import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

const HOLD_MS = 1700;
const SPARKS = 12;

/**
 * A short, non-skippable beat between the wheel stopping and the question
 * appearing. It exists so the player registers WHICH topic they landed on —
 * without it the question feels arbitrary.
 */
export default function CategoryReveal({ category, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), HOLD_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="reveal"
      style={{ '--cat': category.color }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="status"
    >
      <motion.div
        className="reveal__card"
        initial={{ scale: 0.82, y: 28 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: -14 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <span className="reveal__halo" aria-hidden="true" />

        {Array.from({ length: SPARKS }, (_, i) => {
          const angle = (i / SPARKS) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              className="reveal__spark"
              aria-hidden="true"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: Math.cos(angle) * 190,
                y: Math.sin(angle) * 140,
                opacity: [0, 1, 0],
                scale: [0, 1.3, 0.2],
              }}
              transition={{ duration: 0.95, delay: 0.14, ease: 'easeOut' }}
            />
          );
        })}

        <p className="eyebrow reveal__eyebrow">Your category</p>

        <motion.span
          className="reveal__icon"
          initial={{ scale: 0.4, rotate: -22 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
        >
          <Icon name={category.icon} size={62} fill />
        </motion.span>

        <motion.h2
          className="reveal__name"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.3 }}
        >
          {category.name}
        </motion.h2>

        <motion.span
          className="reveal__rule"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}
