// ============================================================================
// TLALMANAC-X · Pollen VERTEX shader — "Sonic Vibration"
// ----------------------------------------------------------------------------
// Displaces each instanced grain along its surface normal with a sine wave
// whose rate is derived from the live audio frequency. This is the visual
// counterpart of Bombus sonication: sound literally shakes the pollen loose.
//
// three.js ShaderMaterial auto-injects: position, normal, uv, instanceMatrix,
// modelViewMatrix, projectionMatrix. We only declare our extras below.
// ============================================================================

uniform float uTime;       // seconds elapsed
uniform float uFrequency;  // audio frequency in Hz (≈400 for Bombus)
uniform float uVibration;  // 0..1 user-driven amplitude

attribute float aPhase;    // per-instance random phase ∈ [0,1)

varying float vGlow;       // passed to fragment: 0..1 oscillation energy

void main() {
  // Angular frequency ω = 2π·f converts Hz → radians/second.
  // We scale by 0.0025 so a 400Hz tone produces a visible (sub-audio-rate)
  // shimmer rather than an imperceptible 400-cycles-per-second blur.
  float omega = 6.28318530718 * uFrequency * 0.0025;

  // Per-grain phase shift (aPhase·2π) decorrelates the swarm so grains don't
  // pulse in lock-step — the cloud breathes organically instead of as a rigid grid.
  float wave = sin(uTime * omega + aPhase * 6.28318530718);

  // Amplitude is the product of user vibration and a small spatial constant.
  // wave ∈ [-1,1] → displacement ∈ [-amp, amp] along the normal.
  float amp = uVibration * 0.45;
  vec3 displaced = position + normal * wave * amp;

  // Glow tracks the *magnitude* of oscillation (abs) gated by vibration:
  // grains at the extremes of their swing are brightest. Clamped in fragment.
  vGlow = abs(wave) * uVibration;

  // Apply per-instance transform, then the standard model-view-projection.
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
