import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import ExplanationCard from './ExplanationCard';
import StreakIndicator from './StreakIndicator';
import Button from './Button';
import Icon from './Icon';

const TARGET = 3;

/**
 * The result screen has to do four jobs without becoming a wall: state the
 * verdict, show the correct answer when the player was wrong, teach, and tell
 * them exactly what to do next. Order is fixed so returning players can skim.
 */
export default function ResultCard({
  isCorrect,
  question,
  selectedOptionIndex,
  streak,
  streakWasBroken,
  onContinue,
}) {
  // A modest burst for a single correct answer; the big prize gets the real show.
  useEffect(() => {
    if (!isCorrect) return;
    confetti({
      particleCount: 46,
      spread: 62,
      startVelocity: 32,
      origin: { y: 0.34 },
      colors: ['#9B6DE9', '#FF9900', '#FFCE3A', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  }, [isCorrect]);

  const oneMore = isCorrect && streak === TARGET - 1;

  return (
    <motion.section
      className={`result result--${isCorrect ? 'correct' : 'wrong'}`}
      initial={{ opacity: 0, y: 26, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.985 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      aria-live="assertive"
    >
      <header className={`verdict verdict--${isCorrect ? 'correct' : 'wrong'}`}>
        <motion.span
          className="verdict__badge"
          initial={{ scale: 0.5, rotate: isCorrect ? -18 : 0 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.05 }}
        >
          <Icon name={isCorrect ? 'correct' : 'wrong'} size={38} fill />
        </motion.span>
        <h2 className="verdict__text">{isCorrect ? 'Correct!' : 'Not quite'}</h2>
      </header>

      {!isCorrect && (
        <div className="compare">
          <div className="compare__row compare__row--yours">
            <span className="compare__label">You answered</span>
            <span className="compare__value">{question.options[selectedOptionIndex]}</span>
          </div>
          <div className="compare__row compare__row--correct">
            <span className="compare__label">Correct answer</span>
            <span className="compare__value">{question.options[question.correctAnswer]}</span>
          </div>
        </div>
      )}

      <ExplanationCard text={question.explanation} />

      {oneMore ? (
        <div className="one-more">
          <span className="one-more__icon">
            <Icon name="bigPrize" size={30} fill />
          </span>
          <div>
            <p className="one-more__title">One more for the bigger prize!</p>
            <p className="one-more__sub">Answer the next question correctly to win it.</p>
          </div>
        </div>
      ) : (
        <div className="reward-row">
          {isCorrect ? (
            <span className="sticker">
              <Icon name="sticker" size={24} fill />
              Sticker unlocked
            </span>
          ) : streakWasBroken ? (
            <div className="reset-note">
              <Icon name="resetPlayer" size={22} className="reset-note__icon" />
              <div>
                <p className="reset-note__main">Streak reset to 0</p>
                <p className="reset-note__sub">No problem — spin again and start a new one.</p>
              </div>
            </div>
          ) : (
            <div className="reset-note">
              <Icon name="learn" size={22} className="reset-note__icon" />
              <div>
                <p className="reset-note__main">Now you know this one</p>
                <p className="reset-note__sub">Spin again to start your streak.</p>
              </div>
            </div>
          )}

          {streak > 0 && <StreakIndicator streak={streak} variant="panel" />}
        </div>
      )}

      <Button
        size="xl"
        variant={oneMore ? 'prize' : 'primary'}
        icon={isCorrect ? 'spin' : 'refresh'}
        iconFill={isCorrect}
        fullWidth
        pulse
        onClick={onContinue}
        autoFocus
      >
        {oneMore ? 'Spin for the win' : isCorrect ? 'Spin again' : 'Try another spin'}
      </Button>
    </motion.section>
  );
}
