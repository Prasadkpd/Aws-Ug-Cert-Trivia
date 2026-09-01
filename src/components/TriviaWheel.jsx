import { useEffect, useRef, useCallback } from 'react';
import { CATEGORIES } from '../data/questions';
import { ICONS } from '../data/icons';
import {
  buildSegmentPath,
  polarToCartesian,
  SEGMENT_ANGLE,
  computeTickTimes,
} from '../utils/wheelUtils';

/* Geometry is expressed in a fixed 400×400 viewBox so every proportion — ring
   weight, label size, hub — scales cleanly with the rendered size. */
const CX = 200;
const CY = 200;
const OUTER_R = 178;
const INNER_R = 54;
const LABEL_R = 121;
const SPIN_DURATION_MS = 4500;

export default function TriviaWheel({
  wheelRotation,
  isSpinning,
  onSpinComplete,
  onSpin,
  selectedSegmentIndex = null,
  play,
}) {
  const groupRef    = useRef(null);
  const tickTimers  = useRef([]);

  const clearTicks = useCallback(() => {
    tickTimers.current.forEach(clearTimeout);
    tickTimers.current = [];
  }, []);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    el.style.transformOrigin = `${CX}px ${CY}px`;

    if (!isSpinning) {
      el.style.transition = 'none';
      el.style.transform = `rotate(${wheelRotation}deg)`;
      return;
    }

    clearTicks();

    /* Ticks are scheduled on the same curve as the transition, so the sound
       decelerates with the wheel instead of running at a constant rate. */
    computeTickTimes(SPIN_DURATION_MS, 40).forEach((ms) => {
      tickTimers.current.push(setTimeout(() => play?.('tick'), ms));
    });

    el.style.transition = `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.05, 1)`;
    el.style.transform = `rotate(${wheelRotation}deg)`;

    const done = setTimeout(() => onSpinComplete?.(), SPIN_DURATION_MS + 50);
    return () => {
      clearTimeout(done);
      clearTicks();
    };
  }, [isSpinning, wheelRotation, onSpinComplete, play, clearTicks]);

  const canSpin = !isSpinning && typeof onSpin === 'function';

  return (
    <button
      type="button"
      className={`wheel ${canSpin ? 'wheel--idle' : ''}`}
      onClick={canSpin ? onSpin : undefined}
      disabled={!canSpin}
      aria-label={canSpin ? 'Spin the trivia wheel' : 'Wheel is spinning'}
    >
      <svg className="wheel__svg" viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          {CATEGORIES.map((cat) => (
            <radialGradient
              key={cat.id}
              id={`seg-${cat.id}`}
              gradientUnits="userSpaceOnUse"
              cx={CX} cy={CY} r={OUTER_R}
            >
              <stop offset="0.28" stopColor={cat.deep} />
              <stop offset="1"    stopColor={cat.color} />
            </radialGradient>
          ))}

          {/* Brass bezel */}
          <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#FFE9A8" />
            <stop offset="0.45" stopColor="#D9A400" />
            <stop offset="0.55" stopColor="#8A6600" />
            <stop offset="1"    stopColor="#FFD75E" />
          </linearGradient>

          <radialGradient id="hub" cx="50%" cy="34%" r="70%">
            <stop offset="0"   stopColor="#2C3446" />
            <stop offset="1"   stopColor="#12161F" />
          </radialGradient>

          <filter id="wheelShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000" floodOpacity="0.55" />
          </filter>

          <filter id="winGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bezel + shadow (static) */}
        <g filter="url(#wheelShadow)">
          <circle cx={CX} cy={CY} r={OUTER_R + 13} fill="#151A24" />
          <circle cx={CX} cy={CY} r={OUTER_R + 8} fill="none" stroke="url(#bezel)" strokeWidth="7" />
          <circle cx={CX} cy={CY} r={OUTER_R + 2} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
        </g>

        {/* Boundary studs */}
        {CATEGORIES.map((_, i) => {
          const p = polarToCartesian(CX, CY, OUTER_R + 8, i * SEGMENT_ANGLE);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4.2" fill="#3A2E05" />
              <circle cx={p.x} cy={p.y} r="3" fill="#FFD75E" />
            </g>
          );
        })}

        {/* ── Rotating group ── */}
        <g ref={groupRef}>
          {CATEGORIES.map((cat, i) => {
            const start = i * SEGMENT_ANGLE;
            const mid   = start + SEGMENT_ANGLE / 2;
            const path  = buildSegmentPath(CX, CY, OUTER_R, INNER_R, start, start + SEGMENT_ANGLE);
            const isWinner = selectedSegmentIndex === i;

            const pos = polarToCartesian(CX, CY, LABEL_R, mid);
            /* Labels read radially. Bottom-half segments are flipped so text is
               never upside down. */
            const flip = mid > 90 && mid < 270;
            const rot  = flip ? mid + 90 : mid - 90;

            return (
              <g key={cat.id} filter={isWinner ? 'url(#winGlow)' : undefined}>
                <path
                  d={path}
                  fill={`url(#seg-${cat.id})`}
                  stroke="rgba(8,11,17,0.85)"
                  strokeWidth="2"
                />
                {/* Inner rim highlight gives the segment a bevelled edge */}
                <path d={path} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />

                <foreignObject
                  x={pos.x - 54}
                  y={pos.y - 27}
                  width="108"
                  height="54"
                  transform={`rotate(${rot}, ${pos.x}, ${pos.y})`}
                >
                  <div className="wheel__seg-label" xmlns="http://www.w3.org/1999/xhtml">
                    <span
                      className="icon"
                      style={{
                        fontSize: '25px',
                        fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
                      }}
                    >
                      {ICONS[cat.icon] ?? cat.icon}
                    </span>
                    <span className="wheel__seg-name">{cat.shortName}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Hub */}
          <circle cx={CX} cy={CY} r={INNER_R} fill="url(#hub)" stroke="#9B6DE9" strokeWidth="2.5" />
          <circle cx={CX} cy={CY} r={INNER_R - 7} fill="none" stroke="rgba(155,109,233,0.35)" strokeWidth="1" />
          <text
            x={CX} y={CY - 12}
            textAnchor="middle" dominantBaseline="central"
            style={{ font: '900 15px Inter, sans-serif', letterSpacing: '0.06em' }}
            fill="#FFFFFF"
          >
            CERT
          </text>
          <text
            x={CX} y={CY + 4}
            textAnchor="middle" dominantBaseline="central"
            style={{ font: '900 15px Inter, sans-serif', letterSpacing: '0.06em' }}
            fill="#B28FF1"
          >
            TRIVIA
          </text>
          {canSpin && (
            <text x={CX} y={CY + 24} textAnchor="middle" className="wheel__hub-hint">
              TAP TO SPIN
            </text>
          )}
        </g>

        <WheelPointer cx={CX} cy={CY} outerR={OUTER_R} />
      </svg>
    </button>
  );
}

/** Fixed pointer at 12 o'clock — the reference the landing maths targets. */
function WheelPointer({ cx, cy, outerR }) {
  const base  = cy - outerR - 20; // sits just outside the bezel
  const tip   = cy - outerR + 16; // bites into the rim
  const halfW = 13;

  return (
    <g>
      <polygon
        points={`${cx},${tip + 3} ${cx - halfW + 1},${base + 4} ${cx + halfW - 1},${base + 4}`}
        fill="rgba(0,0,0,0.45)"
      />
      <polygon
        points={`${cx},${tip} ${cx - halfW},${base} ${cx + halfW},${base}`}
        fill="#FFD75E"
        stroke="#8A6600"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points={`${cx},${tip - 5} ${cx - halfW + 4},${base + 6} ${cx + halfW - 4},${base + 6}`}
        fill="rgba(255,255,255,0.4)"
      />
      <circle cx={cx} cy={base - 3} r="7" fill="#1C222E" stroke="#FFD75E" strokeWidth="2" />
      <circle cx={cx} cy={base - 3} r="2.4" fill="#FFD75E" />
    </g>
  );
}
