import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import Icon from './Icon';
import { computeAccuracy } from '../utils/statsUtils';

/**
 * Volunteer controls, hidden behind the gear so a player never opens it by
 * accident. Destructive actions require a second tap — a booth volunteer is
 * usually mid-conversation and should not be able to wipe the day's stats with
 * one mis-tap.
 */
export default function VolunteerPanel({
  stats,
  soundEnabled,
  onToggleSound,
  onResetPlayer,
  onResetStats,
  onClose,
}) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && !!document.fullscreenElement
  );

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const accuracy = computeAccuracy(stats.totalCorrect, stats.totalQuestions);

  return (
    <>
      <motion.div
        className="scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      <motion.aside
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label="Volunteer controls"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        <header className="panel__head">
          <Icon name="settings" size={22} />
          <h2 className="panel__title">Volunteer Controls</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close panel">
            <Icon name="close" size={22} />
          </button>
        </header>

        <div className="panel__body">
          <section className="panel__section">
            <h3 className="panel__section-title">
              <Icon name="stats" size={16} />
              Booth Statistics
            </h3>

            <div className="stat-grid">
              <StatCard icon="players"  value={stats.totalPlayers}     label="Players" />
              <StatCard icon="question" value={stats.totalQuestions}   label="Questions" />
              <StatCard icon="accuracy" value={`${accuracy}%`}         label="Accuracy" tint="var(--color-info)" />
              <StatCard icon="trend"    value={stats.highestStreak}    label="Best streak" tint="var(--color-prize)" />
            </div>

            <div className="stat-list">
              <StatRow label="Correct answers"  value={stats.totalCorrect} />
              <StatRow label="Wrong answers"    value={stats.totalWrong} />
              <StatRow label="Stickers awarded" value={stats.stickersAwarded} />
              <StatRow label="Big prizes given" value={stats.bigPrizesAwarded} />
            </div>
          </section>

          <section className="panel__section">
            <h3 className="panel__section-title">
              <Icon name="settings" size={16} />
              Session
            </h3>

            <Button
              variant="secondary"
              icon="resetPlayer"
              fullWidth
              onClick={() => { onResetPlayer(); onClose(); }}
            >
              Reset current player
            </Button>

            <Button
              variant="ghost"
              icon={soundEnabled ? 'soundOn' : 'soundOff'}
              fullWidth
              onClick={onToggleSound}
              aria-pressed={soundEnabled}
            >
              Sound: {soundEnabled ? 'On' : 'Off'}
            </Button>

            <Button
              variant="ghost"
              icon={isFullscreen ? 'fullscreenExit' : 'fullscreen'}
              fullWidth
              onClick={toggleFullscreen}
            >
              {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            </Button>
          </section>

          <section className="panel__section">
            <h3 className="panel__section-title">
              <Icon name="warning" size={16} />
              Danger Zone
            </h3>

            {confirmingReset ? (
              <div className="confirm">
                <p className="confirm__text">
                  Erase all booth statistics? This cannot be undone.
                </p>
                <div className="confirm__actions">
                  <Button variant="ghost" onClick={() => setConfirmingReset(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    icon="delete"
                    onClick={() => { onResetStats(); setConfirmingReset(false); }}
                  >
                    Erase
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="danger" icon="delete" fullWidth onClick={() => setConfirmingReset(true)}>
                Reset booth statistics
              </Button>
            )}
          </section>
        </div>
      </motion.aside>
    </>
  );
}

function StatCard({ icon, value, label, tint }) {
  return (
    <div className="stat-card" style={tint ? { '--tint': tint } : undefined}>
      <span className="stat-card__top"><Icon name={icon} size={17} /></span>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="stat-list__row">
      <span className="stat-list__label">{label}</span>
      <span className="stat-list__value">{value}</span>
    </div>
  );
}
