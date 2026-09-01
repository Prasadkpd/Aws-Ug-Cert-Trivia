import questions from '../data/questions';

/**
 * Shuffle an array (Fisher-Yates in-place). Returns the same array.
 */
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Return questions belonging to a given category id.
 * For "random" category, returns all questions (preferring Medium/Challenge).
 */
export function getQuestionsForCategory(categoryId) {
  if (categoryId === 'random') {
    // For Random Challenge, prefer Medium + Challenge difficulty questions.
    const hard = questions.filter(
      (q) => q.difficulty === 'Medium' || q.difficulty === 'Challenge'
    );
    return hard.length >= 4 ? hard : questions;
  }
  return questions.filter((q) => q.category === categoryId);
}

/**
 * Select a question for the given category, excluding recently seen question IDs.
 * Returns a new question object with shuffled options and updated correctIndex.
 *
 * @param {string}   categoryId
 * @param {Set<number>} recentIds   Set of recently used question IDs to avoid
 * @returns {{ question: object, updatedRecentIds: Set<number> }}
 */
export function selectQuestion(categoryId, recentIds) {
  let pool = getQuestionsForCategory(categoryId);

  // Exclude recently seen IDs if we have enough unseen questions.
  const unseen = pool.filter((q) => !recentIds.has(q.id));
  if (unseen.length > 0) {
    pool = unseen;
  }
  // If all have been seen, reset the pool (but still exclude the very last one shown).
  // That logic is fine because `pool` already equals the full category set here.

  const baseQuestion = pool[Math.floor(Math.random() * pool.length)];

  // Shuffle the options while tracking which one is correct.
  const optionsWithIndex = baseQuestion.options.map((text, i) => ({
    text,
    isCorrect: i === baseQuestion.correctAnswer,
  }));
  shuffle(optionsWithIndex);

  const newCorrectIndex = optionsWithIndex.findIndex((o) => o.isCorrect);

  const shuffledQuestion = {
    ...baseQuestion,
    options: optionsWithIndex.map((o) => o.text),
    correctAnswer: newCorrectIndex,
  };

  // Update recent IDs (keep the last 10 to avoid repetition without locking too many).
  const updatedRecentIds = new Set(recentIds);
  updatedRecentIds.add(baseQuestion.id);
  if (updatedRecentIds.size > 10) {
    const [firstId] = updatedRecentIds;
    updatedRecentIds.delete(firstId);
  }

  return { question: shuffledQuestion, updatedRecentIds };
}
