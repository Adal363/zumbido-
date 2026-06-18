/**
 * TLALMANAC-X · Ecosystem Store (Zustand)
 *
 * Single source of truth for the reactive ecosystem simulation.
 * Every visual/audio subsystem (Scene, PollenSystem, AudioEngine) subscribes
 * to slices of this store and reacts to changes — no prop drilling.
 *
 * STATE GROUPS:
 *  · Interaction  → isUserHolding
 *  · Audio        → audioFrequency, audioGain
 *  · Simulation   → vibrationIntensity, healthScore
 *  · Narrative    → scrollProgress, restorationActions
 */

import { create } from 'zustand';

/** Restoration actions the user can trigger in the finale phase. */
export type RestorationAction =
  | 'native_flowers'
  | 'reduce_chemicals'
  | 'conserve_borders';

/** How much each action contributes to the ecosystem health score. */
const ACTION_HEALTH_GAIN: Record<RestorationAction, number> = {
  native_flowers: 12,
  reduce_chemicals: 15,
  conserve_borders: 10,
};

export interface EcosystemState {
  // ── Interaction ──────────────────────────────────────────────
  /** True while the pointer/touch is pressed (user "holds the buzz"). */
  isUserHolding: boolean;

  // ── Audio ────────────────────────────────────────────────────
  /** Oscillator frequency in Hz (Bombus sonication ≈ 400Hz fundamental). */
  audioFrequency: number;
  /** Master gain 0..1. Ramped to 0 on release for a smooth fade-out. */
  audioGain: number;

  // ── Simulation ───────────────────────────────────────────────
  /** Normalized 0..1 amplitude driving particle oscillation in the shader. */
  vibrationIntensity: number;
  /** Ecosystem health 0..100, raised by restoration actions. */
  healthScore: number;

  // ── Narrative ────────────────────────────────────────────────
  /** Scroll position 0 (hero) → 1 (finale), used for phase transitions. */
  scrollProgress: number;
  /** Actions the user has committed to (deduplicated). */
  restorationActions: RestorationAction[];

  // ── Actions ──────────────────────────────────────────────────
  setUserHolding: (holding: boolean) => void;
  setAudioFrequency: (hz: number) => void;
  setAudioGain: (gain: number) => void;
  setVibrationIntensity: (intensity: number) => void;
  setScrollProgress: (progress: number) => void;
  addRestorationAction: (action: RestorationAction) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  isUserHolding: false,
  audioFrequency: 400,
  audioGain: 0,
  vibrationIntensity: 0,
  healthScore: 42, // baseline ecosystem health before any restoration
  scrollProgress: 0,
  restorationActions: [] as RestorationAction[],
};

export const useEcosystemStore = create<EcosystemState>((set) => ({
  ...INITIAL_STATE,

  /**
   * Toggle the "holding" interaction.
   * On RELEASE we proactively zero the audio gain and vibration so downstream
   * subscribers (AudioEngine, PollenSystem) ramp/settle smoothly. The actual
   * de-ramp curve lives in the audio engine; here we only set the target.
   */
  setUserHolding: (holding) =>
    set(() =>
      holding
        ? { isUserHolding: true }
        : { isUserHolding: false, audioGain: 0, vibrationIntensity: 0 }
    ),

  setAudioFrequency: (hz) =>
    set({ audioFrequency: Math.max(20, Math.min(20000, hz)) }),

  setAudioGain: (gain) => set({ audioGain: Math.max(0, Math.min(1, gain)) }),

  setVibrationIntensity: (intensity) =>
    set({ vibrationIntensity: Math.max(0, Math.min(1, intensity)) }),

  setScrollProgress: (progress) =>
    set({ scrollProgress: Math.max(0, Math.min(1, progress)) }),

  addRestorationAction: (action) =>
    set((state) => {
      if (state.restorationActions.includes(action)) return state;
      const nextHealth = Math.min(
        100,
        state.healthScore + ACTION_HEALTH_GAIN[action]
      );
      return {
        restorationActions: [...state.restorationActions, action],
        healthScore: nextHealth,
      };
    }),

  reset: () => set({ ...INITIAL_STATE }),
}));
