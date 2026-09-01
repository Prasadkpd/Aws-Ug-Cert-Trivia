/**
 * Centralised Material Symbols mapping.
 *
 * Every icon in the app is referenced by a SEMANTIC name here — never by the
 * raw glyph name at the call site. This keeps iconography consistent and makes
 * a global swap a one-line change.
 *
 * The font is self-hosted and subset to exactly these glyphs
 * (public/fonts/material-symbols-rounded.woff2 — 62 KB). If you add a name
 * below you must also re-subset the font; see README → "Adding icons".
 */
export const ICONS = {
  // ── Wheel categories ──────────────────────────────
  fundamentals: 'cloud',
  compute:      'memory',
  storage:      'database',
  security:     'security',
  networking:   'lan',
  billing:      'payments',
  monitoring:   'monitor_heart',
  random:       'shuffle',

  // ── Game actions & states ─────────────────────────
  spin:        'casino',
  spinning:    'autorenew',
  question:    'quiz',
  correct:     'check_circle',
  wrong:       'cancel',
  check:       'check',
  explanation: 'lightbulb',
  learn:       'school',

  // ── Rewards ───────────────────────────────────────
  sticker:  'local_activity',
  prize:    'redeem',
  bigPrize: 'emoji_events',
  streak:   'local_fire_department',
  celebrate:'celebration',
  medal:    'workspace_premium',

  // ── Volunteer / system controls ────────────────────
  settings:       'settings',
  fullscreen:     'fullscreen',
  fullscreenExit: 'fullscreen_exit',
  soundOn:        'volume_up',
  soundOff:       'volume_off',
  stats:          'bar_chart',
  players:        'group',
  accuracy:       'percent',
  trend:          'trending_up',
  resetPlayer:    'restart_alt',
  refresh:        'refresh',
  delete:         'delete',
  warning:        'warning',
  close:          'close',
  next:           'arrow_forward',
  energy:         'bolt',
};

/** Resolve a semantic name to a glyph, falling back to the raw string. */
export function resolveIcon(name) {
  return ICONS[name] ?? name;
}
