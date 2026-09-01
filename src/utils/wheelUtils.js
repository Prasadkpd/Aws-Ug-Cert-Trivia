import { CATEGORIES } from '../data/questions';

export const SEGMENT_COUNT = CATEGORIES.length; // 8
export const SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 45°

/**
 * Convert polar coordinates (0° = top, clockwise positive) to SVG Cartesian.
 */
export function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Build an SVG donut-sector path for a wheel segment.
 */
export function buildSegmentPath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd   = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd   = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc   = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    `L ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    'Z',
  ].join(' ');
}

/**
 * Calculate the total accumulated rotation (degrees, clockwise) needed so the
 * wheel visually lands on `segmentIndex` under the pointer at the top.
 *
 * Convention:
 *   - Segment i starts at angle i * 45° (clockwise from top).
 *   - Pointer is fixed at the top (0° / 360°).
 *   - When the wheel has rotated R degrees CW, the angle of the wheel that sits
 *     under the pointer is (360 - R % 360) % 360.
 *   - To land on segment i we need: (360 - R % 360) % 360 ≡ center_angle_of_i
 *   - where center_angle_of_i = i * 45 + 22.5
 *
 * @param {number} segmentIndex   0-7
 * @param {number} currentRotation  accumulated degrees from previous spins
 * @param {number} numFullSpins     number of full 360° rotations to add (visual effect)
 */
export function calculateSpinRotation(segmentIndex, currentRotation, numFullSpins = 7) {
  const centerAngle = segmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2; // e.g. 22.5, 67.5 …
  const currentMod  = currentRotation % 360;

  // Additional rotation needed to bring `centerAngle` under the pointer.
  // Under pointer means: centerAngle + totalR ≡ 0 (mod 360)
  // → totalR ≡ -centerAngle (mod 360) → deltaR = (360 - centerAngle - currentMod + 360) % 360
  let delta = (360 - centerAngle - currentMod + 720) % 360;

  // Ensure the wheel spins at least one full segment so it always moves visibly.
  if (delta < SEGMENT_ANGLE) delta += 360;

  return currentRotation + delta + numFullSpins * 360;
}

/**
 * Given the CURRENT accumulated rotation, determine which segment is under
 * the pointer. Used after spin to confirm the visually-landed segment.
 */
export function getSegmentAtPointer(currentRotation) {
  const normalised = ((360 - currentRotation % 360) % 360 + 360) % 360;
  return Math.floor(normalised / SEGMENT_ANGLE) % SEGMENT_COUNT;
}

/**
 * Pick a random segment index — but optionally exclude the last-spun index
 * to avoid landing on the same category twice in a row.
 */
export function pickRandomSegment(excludeIndex = null) {
  let idx;
  do {
    idx = Math.floor(Math.random() * SEGMENT_COUNT);
  } while (idx === excludeIndex && SEGMENT_COUNT > 1);
  return idx;
}

/**
 * Compute evenly-spaced tick times (ms from 0) for a spin of `totalMs` duration
 * that crosses `numTicks` segment boundaries.  Ticks accelerate during the fast
 * phase and slow as the wheel decelerates, matching the visual easing.
 */
export function computeTickTimes(totalMs, numTicks = 30) {
  const times = [];
  for (let i = 0; i < numTicks; i++) {
    // Ease-in-out: ticks bunched at start and end
    const t = (i + 1) / numTicks;
    // Use the inverse of the deceleration curve (approximate): starts fast, slows at end.
    // Simple quadratic-ease-out approximation: position = 1 - (1-t)^2
    // We want the times, so: t_real = 1 - sqrt(1 - position) — mapped back to ms
    const ms = (1 - Math.pow(1 - t, 2.5)) * totalMs * 0.85; // ticks finish before final stop
    times.push(Math.round(ms));
  }
  return times;
}
