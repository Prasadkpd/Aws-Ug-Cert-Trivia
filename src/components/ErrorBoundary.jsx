import { Component } from 'react';
import Icon from './Icon';
import Button from './Button';

/**
 * The booth runs unattended for hours with nobody watching a console, so a
 * render crash must present a recoverable screen rather than a white page.
 * Reloading is safe: booth stats live in localStorage, not in memory.
 */
export default class ErrorBoundary extends Component {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(error, info) {
    console.error('Cert Trivia crashed:', error, info);
  }

  render() {
    if (!this.state.crashed) return this.props.children;

    return (
      <div className="fatal">
        <div className="fatal__inner">
          <span className="fatal__icon">
            <Icon name="refresh" size={44} />
          </span>
          <h1 className="fatal__title">Let&rsquo;s reset the game</h1>
          <p className="fatal__sub">
            Something went wrong. Booth statistics are saved — reloading will
            pick up right where the day left off.
          </p>
          <Button size="lg" icon="refresh" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    );
  }
}
