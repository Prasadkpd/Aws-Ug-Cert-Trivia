import { motion } from 'framer-motion';
import Icon from './Icon';

const TARGET = 3;

/**
 * The streak is the game's whole tension, so it is shown with a colour ladder
 * that escalates rather than a flat counter: purple at 1, orange at 2 ("one
 * more"), gold at 3. Pips make progress countable at a glance from across the
 * booth — colour alone never carries the meaning.
 *
 * variant: 'chip' (header) | 'panel' (stage / result)
 */
export default function StreakIndicator({ streak = 0, variant = 'chip' }) {
  const level = streak >= TARGET ? 'maxed' : streak === TARGET - 1 ? 'hot' : 'base';
  const icon  = level === 'maxed' ? 'bigPrize' : 'streak';

  const pips = Array.from({ length: TARGET }, (_, i) => (
    <Pip key={i} on={i < streak} large={variant === 'panel'} index={i} />
  ));

  if (variant === 'chip') {
    return (
      <div
        className={`streak-chip streak-chip--${level}`}
        role="status"
        aria-label={`Streak ${streak} of ${TARGET}`}
      >
        <Icon name={icon} size={22} fill className="streak-chip__icon" />
        <span className="streak-chip__count">{streak}/{TARGET}</span>
        <span className="streak-chip__pips" aria-hidden="true">{pips}</span>
      </div>
    );
  }

  return (
    <div
      className={`streak-panel streak-panel--${level}`}
      role="status"
      aria-label={`Streak ${streak} of ${TARGET}`}
    >
      <span className="streak-panel__icon">
        <Icon name={icon} size={26} fill />
      </span>
      <div className="streak-panel__body">
        <div className="streak-panel__top">
          <span className="streak-panel__label">Streak</span>
          <span className="streak-panel__count">{streak} / {TARGET}</span>
        </div>
        <div className="streak-panel__pips" aria-hidden="true">{pips}</div>
      </div>
    </div>
  );
}

function Pip({ on, large, index }) {
  return (
    <motion.span
      className={`pip ${on ? 'pip--on' : ''} ${large ? 'pip--lg' : ''}`}
      initial={false}
      animate={on ? { scale: [1, 1.45, 1] } : { scale: 1 }}
      transition={{ duration: 0.42, delay: on ? index * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
