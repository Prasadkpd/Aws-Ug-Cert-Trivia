import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Button from './Button';
import Icon from './Icon';

const BRAND = ['#9B6DE9', '#FFCE3A', '#FF9900', '#B28FF1', '#FFFFFF'];
const MOTES = 16;

/**
 * The payoff moment. This is intentionally the loudest thing in the app — it is
 * what makes bystanders look over and queue up, which is the entire point of a
 * booth game. Every other celebration is deliberately smaller than this one.
 */
export default function BigPrizeCelebration({ onNextPlayer }) {
  const timers = useRef([]);

  useEffect(() => {
    const fire = (fn, delay) => timers.current.push(setTimeout(fn, delay));

    confetti({
      particleCount: 190,
      spread: 122,
      startVelocity: 46,
      origin: { y: 0.4 },
      colors: BRAND,
      disableForReducedMotion: true,
    });

    fire(() => {
      confetti({ particleCount: 90, angle: 60,  spread: 60, origin: { x: 0 }, colors: BRAND, disableForReducedMotion: true });
      confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1 }, colors: BRAND, disableForReducedMotion: true });
    }, 260);

    fire(() => {
      confetti({
        particleCount: 130,
        spread: 150,
        startVelocity: 34,
        decay: 0.92,
        origin: { y: 0.32 },
        colors: BRAND,
        disableForReducedMotion: true,
      });
    }, 680);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <motion.div
      className="prize"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="alertdialog"
      aria-label="You won the bigger prize"
    >
      <span className="prize__rays" aria-hidden="true" />

      {Array.from({ length: MOTES }, (_, i) => (
        <motion.span
          key={i}
          className="prize__mote"
          aria-hidden="true"
          style={{
            left: `${(i * 6.5 + 6) % 96}%`,
            width: 4 + (i % 3) * 3,
            height: 4 + (i % 3) * 3,
          }}
          initial={{ top: '104%', opacity: 0 }}
          animate={{ top: '-8%', opacity: [0, 0.85, 0] }}
          transition={{
            duration: 5.5 + (i % 4),
            delay: i * 0.22,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      <div className="prize__inner">
        <motion.span
          className="prize__trophy"
          initial={{ scale: 0.3, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        >
          <Icon name="bigPrize" size={116} fill />
        </motion.span>

        <motion.h2
          className="prize__title"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.16, type: 'spring', stiffness: 250, damping: 16 }}
        >
          3 IN A ROW!
        </motion.h2>

        <motion.p
          className="prize__sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.34 }}
        >
          Perfect streak
        </motion.p>

        <motion.div
          className="prize__badge"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.46, type: 'spring', stiffness: 240, damping: 15 }}
        >
          <Icon name="prize" size={40} fill />
          You&rsquo;ve won the BIGGER PRIZE
        </motion.div>

        <motion.p
          className="prize__hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.66, duration: 0.34 }}
        >
          <Icon name="players" size={22} />
          Show this screen to a booth volunteer to collect it.
        </motion.p>

        <motion.div
          className="prize__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.34 }}
        >
          <Button size="hero" variant="prize" icon="next" onClick={onNextPlayer} autoFocus>
            Next Player
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
