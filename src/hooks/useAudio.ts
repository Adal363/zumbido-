/**
 * TLALMANAC-X · Audio Engine (Tone.js)
 *
 * Renders nothing (returns null). Owns the Web Audio graph and binds it to the
 * Zustand store so audio is a pure function of application state.
 *
 * SIGNAL GRAPH:
 *   Oscillator (sawtooth) ──▶ Gain ──▶ Destination
 *
 * A sawtooth at 400Hz approximates the buzzing harmonic richness of Bombus
 * sonication far better than a sine — the higher harmonics give it "grain".
 *
 * Browsers suspend the AudioContext until a user gesture, so we lazily call
 * Tone.start() on the first pointer/touch interaction.
 */

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useEcosystemStore } from '../store/useEcosystemStore';

/** Seconds for gain to ramp toward its target — short enough to feel responsive. */
const GAIN_RAMP = 0.08;
/** Seconds for frequency glides — slightly slower for a natural pitch slide. */
const FREQ_RAMP = 0.12;

export const AudioEngine: React.FC = () => {
  const oscRef = useRef<Tone.Oscillator | null>(null);
  const gainRef = useRef<Tone.Gain | null>(null);
  const startedRef = useRef(false);

  // ── Build the audio graph once ─────────────────────────────────
  useEffect(() => {
    const gain = new Tone.Gain(0).toDestination();
    const osc = new Tone.Oscillator({
      frequency: useEcosystemStore.getState().audioFrequency,
      type: 'sawtooth',
    }).connect(gain);

    gainRef.current = gain;
    oscRef.current = osc;

    // Start the AudioContext on the first gesture, then start the oscillator.
    const unlock = async () => {
      if (startedRef.current) return;
      await Tone.start();
      osc.start();
      startedRef.current = true;
    };
    document.addEventListener('mousedown', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });

    return () => {
      document.removeEventListener('mousedown', unlock);
      document.removeEventListener('touchstart', unlock);
      osc.dispose();
      gain.dispose();
      oscRef.current = null;
      gainRef.current = null;
    };
  }, []);

  // ── Drive gain from store.audioGain ────────────────────────────
  useEffect(() => {
    const unsub = useEcosystemStore.subscribe((state) => {
      const g = gainRef.current;
      if (!g) return;
      // rampTo schedules a smooth linear ramp on the audio thread — no clicks.
      g.gain.rampTo(state.audioGain, GAIN_RAMP);
    });
    return unsub;
  }, []);

  // ── Drive pitch from store.audioFrequency ──────────────────────
  useEffect(() => {
    const unsub = useEcosystemStore.subscribe((state) => {
      const o = oscRef.current;
      if (!o) return;
      o.frequency.rampTo(state.audioFrequency, FREQ_RAMP);
    });
    return unsub;
  }, []);

  return null;
};

export default AudioEngine;
