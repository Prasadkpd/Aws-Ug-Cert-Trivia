import { AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';
import ResultCard from './ResultCard';

/**
 * Question and result are the same slot in the flow, so they cross-fade in one
 * AnimatePresence rather than remounting the whole stage.
 */
export default function QuestionScreen({
  question,
  category,
  streak,
  streakWasBroken,
  selectedOptionIndex,
  isCorrect,
  showResult,
  onSelectAnswer,
  onContinue,
  autoAdvanceMs,
}) {
  return (
    <div className="q-stage">
      <AnimatePresence mode="wait" initial={false}>
        {showResult ? (
          <ResultCard
            key="result"
            isCorrect={isCorrect}
            question={question}
            selectedOptionIndex={selectedOptionIndex}
            streak={streak}
            streakWasBroken={streakWasBroken}
            onContinue={onContinue}
            autoAdvanceMs={autoAdvanceMs}
          />
        ) : (
          <QuestionCard
            key="question"
            question={question}
            category={category}
            streak={streak}
            selectedOptionIndex={selectedOptionIndex}
            onSelectAnswer={onSelectAnswer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
