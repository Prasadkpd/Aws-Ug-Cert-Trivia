import { motion, AnimatePresence } from 'framer-motion';
import TriviaWheel from './TriviaWheel';
import StreakIndicator from './StreakIndicator';
import Button from './Button';
import Icon from './Icon';

/**
 * READY and SPINNING share this one mount so the wheel is never unmounted
 * mid-rotation — the CSS transition on the rotating group would be discarded
 * and the wheel would visibly snap.
 *
 * Layout is side-by-side: the wheel takes the larger column because it is the
 * thing that draws people to the booth, and the right column carries the read-
 * and-act content at a comfortable standing reach. Only the right column swaps
 * between the reward legend (ready) and a live status readout (spinning).
 */
export default function WheelStage({
  wheelRotation,
  isSpinning,
  streak,
  landedSegmentIndex,
  onSpin,
  onSpinComplete,
  play,
}) {
  return (
    <div className="wheel-stage">
      <div className="wheel-stage__wheel">
        <TriviaWheel
          wheelRotation={wheelRotation}
          isSpinning={isSpinning}
          onSpin={isSpinning ? undefined : onSpin}
          onSpinComplete={onSpinComplete}
          selectedSegmentIndex={landedSegmentIndex}
          play={play}
        />
      </div>

      <div className="wheel-stage__intro">
        <p className="wheel-stage__eyebrow">
          <Icon name="fundamentals" size={16} fill />
          Cloud Practitioner Trivia
        </p>

        <h1 className="wheel-stage__title">
          Spin the wheel.
          <em>Win a prize.</em>
        </h1>

        <p className="wheel-stage__tagline">
          One spin picks your topic. Answer correctly to win — three in a row
          takes the big prize.
        </p>

        {streak > 0 && <StreakIndicator streak={streak} variant="panel" />}

        <AnimatePresence mode="wait" initial={false}>
          {isSpinning ? (
            <motion.div
              key="status"
              className="spin-status"
              role="status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <p className="spin-status__title">
                <Icon name="spinning" size={22} />
                Spinning
              </p>
              <p className="spin-status__sub">Finding your category…</p>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="wheel-stage__ready"
            >
              <div className="wheel-stage__cta">
                <Button
                  size="hero"
                  icon="spin"
                  iconFill
                  pulse
                  onClick={onSpin}
                >
                  Spin the Wheel
                </Button>
              </div>

              <ul className="legend">
                <li className="legend__row" style={{ '--tint': 'var(--color-heat)' }}>
                  <span className="legend__icon"><Icon name="sticker" size={20} fill /></span>
                  <span><strong>1 correct answer</strong> → sticker</span>
                </li>
                <li className="legend__row" style={{ '--tint': 'var(--color-prize)' }}>
                  <span className="legend__icon"><Icon name="bigPrize" size={20} fill /></span>
                  <span><strong>3 correct in a row</strong> → bigger prize</span>
                </li>
                <li className="legend__row" style={{ '--tint': 'var(--color-info)' }}>
                  <span className="legend__icon"><Icon name="explanation" size={20} fill /></span>
                  <span>Every question comes with an <strong>explanation</strong></span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
