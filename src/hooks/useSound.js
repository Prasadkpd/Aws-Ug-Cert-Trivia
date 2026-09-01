import { useRef, useCallback } from 'react';
import { loadSoundEnabled, saveSoundEnabled } from '../utils/statsUtils';
import { useState } from 'react';

/**
 * All sounds are synthesised via the Web Audio API — no external files required.
 * Drop actual .mp3/.ogg files into public/sounds/ with the names below and this
 * hook will prefer them automatically once the audio paths are wired up.
 */

let sharedCtx = null;

function getCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    try {
      sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return sharedCtx;
}

function resumeCtx(ctx) {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

// ─── synthesised sound builders ─────────────────────────────────────────────

function playTone(ctx, { freq = 440, type = 'sine', gainVal = 0.3, duration = 0.15, startDelay = 0 } = {}) {
  if (!ctx) return;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
  gain.gain.setValueAtTime(0, ctx.currentTime + startDelay);
  gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + startDelay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
  osc.start(ctx.currentTime + startDelay);
  osc.stop(ctx.currentTime + startDelay + duration + 0.01);
}

function synthTick(ctx) {
  if (!ctx) return;
  const buf    = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
  }
  const src  = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buf;
  src.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  src.start(ctx.currentTime);
}

function synthCorrect(ctx) {
  if (!ctx) return;
  playTone(ctx, { freq: 523.25, type: 'triangle', gainVal: 0.4, duration: 0.12 });
  playTone(ctx, { freq: 659.25, type: 'triangle', gainVal: 0.35, duration: 0.12, startDelay: 0.1 });
  playTone(ctx, { freq: 783.99, type: 'triangle', gainVal: 0.3,  duration: 0.2,  startDelay: 0.2 });
}

function synthWrong(ctx) {
  if (!ctx) return;
  playTone(ctx, { freq: 220, type: 'sawtooth', gainVal: 0.2, duration: 0.25 });
  playTone(ctx, { freq: 196, type: 'sawtooth', gainVal: 0.18, duration: 0.3, startDelay: 0.22 });
}

function synthBigPrize(ctx) {
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((freq, i) => {
    playTone(ctx, { freq, type: 'triangle', gainVal: 0.35, duration: 0.2, startDelay: i * 0.1 });
  });
  playTone(ctx, { freq: 1567.98, type: 'sine', gainVal: 0.4, duration: 0.6, startDelay: 0.6 });
}

function synthCategoryReveal(ctx) {
  if (!ctx) return;
  playTone(ctx, { freq: 880, type: 'sine', gainVal: 0.25, duration: 0.3 });
}

function synthClick(ctx) {
  if (!ctx) return;
  playTone(ctx, { freq: 600, type: 'sine', gainVal: 0.15, duration: 0.06 });
}

// ─── hook ────────────────────────────────────────────────────────────────────

export default function useSound() {
  const [soundEnabled, setSoundEnabledState] = useState(() => loadSoundEnabled());
  const enabledRef = useRef(soundEnabled);
  enabledRef.current = soundEnabled;

  const setSoundEnabled = useCallback((val) => {
    setSoundEnabledState(val);
    enabledRef.current = val;
    saveSoundEnabled(val);
  }, []);

  const play = useCallback((name) => {
    if (!enabledRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    resumeCtx(ctx);
    switch (name) {
      case 'tick':           synthTick(ctx);           break;
      case 'correct':        synthCorrect(ctx);        break;
      case 'wrong':          synthWrong(ctx);          break;
      case 'bigPrize':       synthBigPrize(ctx);       break;
      case 'categoryReveal': synthCategoryReveal(ctx); break;
      case 'click':          synthClick(ctx);          break;
      default: break;
    }
  }, []);

  return { soundEnabled, setSoundEnabled, play };
}
