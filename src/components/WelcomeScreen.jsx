import { motion } from 'framer-motion';
import Logo from './Logo';
import Button from './Button';

/**
 * Attract screen. This is what the booth shows when nobody is playing, so it
 * leads with the organiser's mark and one unmissable action.
 */
export default function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      className="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.4 }}
    >
      <div className="welcome__inner">
        <motion.div
          className="welcome__logo"
          initial={{ opacity: 0, y: -20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo size="hero" />
        </motion.div>

        <motion.p
          className="welcome__event"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.36 }}
        >
          Community Day
        </motion.p>

        <motion.p
          className="welcome__country"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.36 }}
        >
          Sri Lanka 2026
        </motion.p>

        <motion.h1
          className="welcome__title"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, type: 'spring', stiffness: 220, damping: 16 }}
        >
          Cert Trivia Wheel
        </motion.h1>

        <motion.span
          className="welcome__rule"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.52, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.p
          className="welcome__tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62, duration: 0.36 }}
        >
          Test your AWS Cloud Practitioner knowledge. Win a prize on the spot.
        </motion.p>

        <motion.div
          className="welcome__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.74, duration: 0.4 }}
        >
          <Button size="hero" icon="spin" iconFill pulse onClick={onStart} autoFocus>
            Start Playing
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
