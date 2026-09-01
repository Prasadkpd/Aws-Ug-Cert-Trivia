import { motion } from 'framer-motion';
import Icon from './Icon';

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * State is always carried by THREE signals — colour, the key badge, and a
 * worded verdict chip — so it survives colour-blindness and the harsh,
 * washed-out viewing angles of a booth screen.
 */
export default function AnswerOption({
  index,
  text,
  answered,
  isSelected,
  isCorrectAnswer,
  onSelect,
}) {
  let state = '';
  if (answered) {
    if (isCorrectAnswer) state = 'correct';
    else if (isSelected) state = 'wrong';
    else state = 'muted';
  }

  const verdict =
    state === 'correct' ? { icon: 'correct', label: isSelected ? 'Correct' : 'Answer' }
    : state === 'wrong' ? { icon: 'wrong', label: 'Your pick' }
    : null;

  // Wrong pick gets a short shake — felt rather than read.
  const animate = state === 'wrong'
    ? { opacity: 1, y: 0, x: [0, -7, 7, -4, 0] }
    : { opacity: 1, y: 0 };

  return (
    <motion.button
      type="button"
      className={`answer ${state ? `answer--${state}` : ''}`}
      onClick={() => !answered && onSelect(index)}
      disabled={answered}
      whileHover={answered ? undefined : { x: 4 }}
      whileTap={answered ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      initial={{ opacity: 0, y: 14 }}
      animate={animate}
    >
      <span className="answer__key" aria-hidden="true">
        {state === 'correct' ? <Icon name="check" size={22} />
          : state === 'wrong' ? <Icon name="close" size={22} />
          : KEYS[index]}
      </span>
      <span className="answer__text">{text}</span>
      {verdict && (
        <span className="answer__verdict">
          <Icon name={verdict.icon} size={16} fill />
          {verdict.label}
        </span>
      )}
    </motion.button>
  );
}
