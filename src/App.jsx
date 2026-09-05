import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

import useTriviaGame, { PHASE } from './hooks/useTriviaGame';
import useSound from './hooks/useSound';

import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeScreen from './components/WelcomeScreen';
import WheelStage from './components/WheelStage';
import CategoryReveal from './components/CategoryReveal';
import QuestionScreen from './components/QuestionScreen';
import BigPrizeCelebration from './components/BigPrizeCelebration';
import NextPlayerScreen from './components/NextPlayerScreen';
import VolunteerPanel from './components/VolunteerPanel';

export default function App() {
  const game = useTriviaGame();
  const { soundEnabled, setSoundEnabled, play } = useSound();
  const [panelOpen, setPanelOpen] = useState(false);

  /* The result screen needs to know whether this wrong answer actually cost the
     player something. By the time it renders the streak is already 0, so the
     pre-answer value is captured here. */
  const streakBeforeAnswer = useRef(0);

  const {
    phase, streak, currentCategory, currentQuestion, selectedOptionIndex,
    isCorrect, wheelRotation, lastSegmentIndex, boothStats,
    startGame, spin, onSpinComplete, onCategoryRevealDone, selectAnswer,
    continueAfterResult, nextPlayer, onHandoffDone, resetCurrentPlayer,
    resetBoothStats,
  } = game;

  const isSpinning = phase === PHASE.SPINNING;
  const showResult = phase === PHASE.RESULT;

  // How long the wrong-result card is shown before the turn ends automatically.
  const AUTO_WRONG_MS = 60_000; // 1 minute

  // ── Sound cues tied to phase changes ──────────────────────────────────
  useEffect(() => {
    if (phase === PHASE.CATEGORY_REVEAL) play('categoryReveal');
    if (phase === PHASE.BIG_PRIZE) play('bigPrize');
  }, [phase, play]);

  useEffect(() => {
    if (phase !== PHASE.RESULT) return;
    play(isCorrect ? 'correct' : 'wrong');
  }, [phase, isCorrect, play]);

  // Wrong answer → automatically end the turn after a brief reveal.
  useEffect(() => {
    if (phase !== PHASE.RESULT || isCorrect !== false) return;
    const t = setTimeout(() => nextPlayer(), AUTO_WRONG_MS);
    return () => clearTimeout(t);
  }, [phase, isCorrect, nextPlayer, AUTO_WRONG_MS]);

  // ── Actions ───────────────────────────────────────────────────────────
  const handleStart = useCallback(() => { play('click'); startGame(); }, [play, startGame]);

  const handleSpin = useCallback(() => { play('click'); spin(); }, [play, spin]);

  const handleSelectAnswer = useCallback((i) => {
    streakBeforeAnswer.current = streak;
    selectAnswer(i);
  }, [selectAnswer, streak]);

  // Correct → same player spins again. Wrong → end the turn immediately (manual skip).
  const handleContinue = useCallback(() => {
    play('click');
    if (isCorrect === false) {
      nextPlayer();
    } else {
      continueAfterResult();
    }
  }, [play, isCorrect, continueAfterResult, nextPlayer]);

  const handleToggleSound = useCallback(() => setSoundEnabled((s) => !s), [setSoundEnabled]);

  /* Space / Enter spins when the wheel is live. A booth machine often has a
     keyboard tucked behind the screen, and volunteers use it to keep a queue
     moving without reaching across the table. */
  useEffect(() => {
    if (phase !== PHASE.READY || panelOpen) return;
    const onKey = (e) => {
      if (e.code !== 'Space' && e.code !== 'Enter') return;
      if (e.target.closest?.('button, input, textarea, select')) return;
      e.preventDefault();
      handleSpin();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, panelOpen, handleSpin]);

  const mood =
    phase === PHASE.BIG_PRIZE ? 'jackpot'
    : phase === PHASE.SPINNING || phase === PHASE.CATEGORY_REVEAL ? 'charged'
    : 'calm';

  const wheelVisible = phase === PHASE.READY || phase === PHASE.SPINNING;

  return (
    <div className="app">
      <AnimatedBackground mood={mood} />

      <Header
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenPanel={() => setPanelOpen(true)}
      />

      <main className="main">
        <div className="stage">
          {wheelVisible && (
            <WheelStage
              wheelRotation={wheelRotation}
              isSpinning={isSpinning}
              streak={streak}
              landedSegmentIndex={isSpinning ? null : lastSegmentIndex}
              onSpin={handleSpin}
              onSpinComplete={onSpinComplete}
              play={play}
            />
          )}

          {(phase === PHASE.QUESTION || phase === PHASE.RESULT) && currentQuestion && (
            <QuestionScreen
              question={currentQuestion}
              category={currentCategory}
              streak={streak}
              streakWasBroken={!isCorrect && streakBeforeAnswer.current > 0}
              selectedOptionIndex={selectedOptionIndex}
              isCorrect={isCorrect}
              showResult={showResult}
              onSelectAnswer={handleSelectAnswer}
              onContinue={handleContinue}
              autoAdvanceMs={AUTO_WRONG_MS}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* ── Overlays ── */}
      <AnimatePresence>
        {phase === PHASE.WELCOME && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}

        {phase === PHASE.CATEGORY_REVEAL && currentCategory && (
          <CategoryReveal
            key="reveal"
            category={currentCategory}
            onDone={onCategoryRevealDone}
          />
        )}

        {phase === PHASE.BIG_PRIZE && (
          <BigPrizeCelebration key="prize" onNextPlayer={nextPlayer} />
        )}

        {phase === PHASE.NEXT_PLAYER && (
          <NextPlayerScreen key="handoff" onDone={onHandoffDone} />
        )}

        {panelOpen && (
          <VolunteerPanel
            key="panel"
            stats={boothStats}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onResetPlayer={resetCurrentPlayer}
            onResetStats={resetBoothStats}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
