import { useReducer, useCallback } from 'react';
import { CATEGORIES } from '../data/questions';
import { calculateSpinRotation, pickRandomSegment } from '../utils/wheelUtils';
import { selectQuestion } from '../utils/questionUtils';
import { loadStats, saveStats, DEFAULT_STATS } from '../utils/statsUtils';

// ─── Game Phases ────────────────────────────────────────────────────────────
export const PHASE = {
  WELCOME:         'WELCOME',
  READY:           'READY',
  SPINNING:        'SPINNING',
  CATEGORY_REVEAL: 'CATEGORY_REVEAL',
  QUESTION:        'QUESTION',
  RESULT:          'RESULT',
  BIG_PRIZE:       'BIG_PRIZE',
  NEXT_PLAYER:     'NEXT_PLAYER',
};

// ─── Initial State ───────────────────────────────────────────────────────────
const PLAYER_DEFAULTS = {
  streak:              0,
  recentQuestionIds:   new Set(),
  currentCategory:     null,
  targetSegmentIndex:  null,
  currentQuestion:     null,
  selectedOptionIndex: null,
  isCorrect:           null,
  questionCount:       0,
  lastSegmentIndex:    null,
  wheelRotation:       0,        // accumulated rotation degrees
};

function buildInitialState() {
  return {
    phase: PHASE.WELCOME,
    ...PLAYER_DEFAULTS,
    boothStats: loadStats(),
  };
}

// ─── Reducer ────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'START_GAME':
      return { ...state, phase: PHASE.READY };

    case 'SPIN': {
      const segIdx = pickRandomSegment(state.lastSegmentIndex);
      const newRotation = calculateSpinRotation(segIdx, state.wheelRotation);
      return {
        ...state,
        phase:               PHASE.SPINNING,
        targetSegmentIndex:  segIdx,
        wheelRotation:       newRotation,
        currentCategory:     null,
        currentQuestion:     null,
        selectedOptionIndex: null,
        isCorrect:           null,
      };
    }

    case 'SPIN_COMPLETE': {
      const category = CATEGORIES[state.targetSegmentIndex];
      return {
        ...state,
        phase:           PHASE.CATEGORY_REVEAL,
        currentCategory: category,
        lastSegmentIndex: state.targetSegmentIndex,
      };
    }

    case 'CATEGORY_REVEAL_DONE': {
      const { question, updatedRecentIds } = selectQuestion(
        state.currentCategory.id,
        state.recentQuestionIds
      );
      return {
        ...state,
        phase:             PHASE.QUESTION,
        currentQuestion:   question,
        recentQuestionIds: updatedRecentIds,
        selectedOptionIndex: null,
        isCorrect: null,
      };
    }

    case 'SELECT_ANSWER': {
      const { optionIndex } = action;
      if (state.selectedOptionIndex !== null) return state; // already answered

      const correct = optionIndex === state.currentQuestion.correctAnswer;
      const newStreak = correct ? state.streak + 1 : 0;
      const newHighest = Math.max(state.boothStats.highestStreak, newStreak);

      const updatedStats = {
        ...state.boothStats,
        totalQuestions:  state.boothStats.totalQuestions + 1,
        totalCorrect:    state.boothStats.totalCorrect    + (correct ? 1 : 0),
        totalWrong:      state.boothStats.totalWrong      + (correct ? 0 : 1),
        stickersAwarded: state.boothStats.stickersAwarded + (correct ? 1 : 0),
        bigPrizesAwarded:
          state.boothStats.bigPrizesAwarded + (newStreak === 3 ? 1 : 0),
        highestStreak: newHighest,
      };
      saveStats(updatedStats);

      return {
        ...state,
        phase:               PHASE.RESULT,
        selectedOptionIndex: optionIndex,
        isCorrect:           correct,
        streak:              newStreak,
        questionCount:       state.questionCount + 1,
        boothStats:          updatedStats,
      };
    }

    case 'CONTINUE_AFTER_RESULT': {
      if (state.streak === 3) {
        return { ...state, phase: PHASE.BIG_PRIZE };
      }
      return { ...state, phase: PHASE.READY };
    }

    /* Clears the player, then parks on a handoff screen so a volunteer has a
       moment to swap people at the booth before the wheel is live again. */
    case 'NEXT_PLAYER': {
      const newStats = {
        ...state.boothStats,
        totalPlayers: state.boothStats.totalPlayers + 1,
      };
      saveStats(newStats);
      return {
        ...state,
        ...PLAYER_DEFAULTS,
        wheelRotation: state.wheelRotation, // keep accumulated rotation visual
        phase:         PHASE.NEXT_PLAYER,
        boothStats:    newStats,
      };
    }

    case 'HANDOFF_DONE':
      return { ...state, phase: PHASE.READY };

    case 'RESET_PLAYER':
      return {
        ...state,
        ...PLAYER_DEFAULTS,
        wheelRotation: state.wheelRotation,
        phase:         PHASE.READY,
      };

    case 'RESET_BOOTH_STATS': {
      const fresh = { ...DEFAULT_STATS };
      saveStats(fresh);
      return { ...state, boothStats: fresh };
    }

    default:
      return state;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export default function useTriviaGame() {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const spin = useCallback(() => {
    if (state.phase !== PHASE.READY) return;
    dispatch({ type: 'SPIN' });
  }, [state.phase]);

  const onSpinComplete = useCallback(() => {
    dispatch({ type: 'SPIN_COMPLETE' });
  }, []);

  const onCategoryRevealDone = useCallback(() => {
    dispatch({ type: 'CATEGORY_REVEAL_DONE' });
  }, []);

  const selectAnswer = useCallback((optionIndex) => {
    if (state.phase !== PHASE.QUESTION) return;
    dispatch({ type: 'SELECT_ANSWER', optionIndex });
  }, [state.phase]);

  const continueAfterResult = useCallback(() => {
    dispatch({ type: 'CONTINUE_AFTER_RESULT' });
  }, []);

  const nextPlayer = useCallback(() => {
    dispatch({ type: 'NEXT_PLAYER' });
  }, []);

  const onHandoffDone = useCallback(() => {
    dispatch({ type: 'HANDOFF_DONE' });
  }, []);

  const resetCurrentPlayer = useCallback(() => {
    dispatch({ type: 'RESET_PLAYER' });
  }, []);

  const resetBoothStats = useCallback(() => {
    dispatch({ type: 'RESET_BOOTH_STATS' });
  }, []);

  return {
    // state
    phase:               state.phase,
    streak:              state.streak,
    currentCategory:     state.currentCategory,
    targetSegmentIndex:  state.targetSegmentIndex,
    wheelRotation:       state.wheelRotation,
    currentQuestion:     state.currentQuestion,
    selectedOptionIndex: state.selectedOptionIndex,
    isCorrect:           state.isCorrect,
    questionCount:       state.questionCount,
    boothStats:          state.boothStats,
    lastSegmentIndex:    state.lastSegmentIndex,

    // actions
    startGame,
    spin,
    onSpinComplete,
    onCategoryRevealDone,
    selectAnswer,
    continueAfterResult,
    nextPlayer,
    onHandoffDone,
    resetCurrentPlayer,
    resetBoothStats,
  };
}
