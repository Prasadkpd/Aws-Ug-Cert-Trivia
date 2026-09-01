import Logo from './Logo';
import Icon from './Icon';
import StreakIndicator from './StreakIndicator';

/**
 * Booth chrome. Deliberately quiet: the organiser lockup identifies the booth,
 * the event line names the game, and everything else is a control. The streak
 * chip only appears once a player is actually on a streak, so an idle booth
 * shows no stale state.
 */
export default function Header({
  streak,
  soundEnabled,
  onToggleSound,
  onOpenPanel,
}) {
  return (
    <header className="header">
      <div className="header__brand">
        <Logo size="sm" />
        <span className="header__rule" aria-hidden="true" />
        <div className="header__event">
          <span className="header__event-line">Community Day Sri Lanka</span>
          <span className="header__event-sub">Cert Trivia Wheel</span>
        </div>
      </div>

      <div className="header__spacer" />

      <div className="header__controls">
        {streak > 0 && <StreakIndicator streak={streak} variant="chip" />}

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          title={soundEnabled ? 'Sound on' : 'Sound off'}
        >
          <Icon name={soundEnabled ? 'soundOn' : 'soundOff'} size={24} />
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={onOpenPanel}
          aria-label="Open volunteer controls"
          title="Volunteer controls"
        >
          <Icon name="settings" size={24} />
        </button>
      </div>
    </header>
  );
}
