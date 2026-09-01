import { motion } from 'framer-motion';
import AnswerOption from './AnswerOption';
import StreakIndicator from './StreakIndicator';
import Icon from './Icon';

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export default function QuestionCard({
  question,
  category,
  streak,
  selectedOptionIndex,
  onSelectAnswer,
}) {
  const answered = selectedOptionIndex !== null;

  return (
    <motion.section
      className="q-card"
      initial={{ opacity: 0, y: 26, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.985 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
    >
      <header className="q-card__meta">
        <span className="cat-badge" style={{ '--cat': category.color }}>
          <Icon name={category.icon} size={18} fill />
          {category.name}
        </span>

        <div className="q-card__meta-right">
          <span className="eyebrow">{DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty}</span>
          {streak > 0 && <StreakIndicator streak={streak} variant="chip" />}
        </div>
      </header>

      <h2 className="q-card__prompt">{question.question}</h2>

      <div className="q-card__answers">
        {question.options.map((option, i) => (
          <AnswerOption
            key={i}
            index={i}
            text={option}
            answered={answered}
            isSelected={selectedOptionIndex === i}
            isCorrectAnswer={question.correctAnswer === i}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>
    </motion.section>
  );
}
