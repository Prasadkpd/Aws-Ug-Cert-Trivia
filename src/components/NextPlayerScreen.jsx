import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import Button from './Button';

const AUTO_ADVANCE_MS = 3200;

/**
 * A short handoff beat between players. It gives the volunteer a natural moment
 * to swap people in, and guarantees the next player never inherits the previous
 * one's streak on screen. Auto-advances so an unattended booth self-recovers.
 */
export default function NextPlayerScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="handoff"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26 }}
      role="status"
    >
      <div className="handoff__inner">
        <motion.span
          className="handoff__icon"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 17 }}
        >
          <Icon name="players" size={54} fill />
        </motion.span>

        <motion.h2
          className="handoff__title"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          Next player, step up!
        </motion.h2>

        <motion.p
          className="handoff__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.3 }}
        >
          Fresh streak, three chances at the bigger prize.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.3 }}
        >
          <Button size="lg" icon="spin" iconFill onClick={onDone} autoFocus>
            I&rsquo;m ready
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
