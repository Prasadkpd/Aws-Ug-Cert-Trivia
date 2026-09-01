const STATS_KEY  = 'cert_trivia_booth_stats';
const SOUND_KEY  = 'cert_trivia_sound_enabled';

export const DEFAULT_STATS = {
  totalPlayers:    0,
  totalQuestions:  0,
  totalCorrect:    0,
  totalWrong:      0,
  stickersAwarded: 0,
  bigPrizesAwarded:0,
  highestStreak:   0,
};

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function clearStats() {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch {
    // ignore
  }
}

export function loadSoundEnabled() {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled) {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // ignore
  }
}

export function computeAccuracy(totalCorrect, totalQuestions) {
  if (!totalQuestions) return 0;
  return Math.round((totalCorrect / totalQuestions) * 100);
}
