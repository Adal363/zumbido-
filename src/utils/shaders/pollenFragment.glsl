// ============================================================================
// TLALMANAC-X · Pollen FRAGMENT shader — "Neon Glow & Dynamic Color"
// Enhanced version with multi-color cycling and frequency-based hue shifts
// ============================================================================

uniform vec3 uColorA;        // Cyan neon
uniform vec3 uColorB;        // Light cyan
uniform vec3 uColorC;        // Magenta neon
uniform vec3 uColorD;        // Orange neon
uniform float uColorIntensity; // Master glow intensity
uniform float uFrequency;    // For hue modulation
uniform float uTime;         // For color animation

varying float vGlow;         // 0..1 oscillation energy from vertex stage

void main() {
  // Glow remapping with aggressive gain for neon effect
  float t = clamp(vGlow * 2.0, 0.0, 1.0);

  // Dynamic color cycling based on frequency and time
  float colorPhase = sin(uFrequency * 0.001 + uTime * 0.5) * 0.5 + 0.5;
  
  vec3 color;
  if (colorPhase < 0.33) {
    // Cyan to Light Cyan
    color = mix(uColorA, uColorB, fract(colorPhase * 3.0));
  } else if (colorPhase < 0.66) {
    // Light Cyan to Magenta
    color = mix(uColorB, uColorC, fract((colorPhase - 0.33) * 3.0));
  } else {
    // Magenta to Orange
    color = mix(uColorC, uColorD, fract((colorPhase - 0.66) * 3.0));
  }

  // Blend active color with base cyan when glowing
  color = mix(color, uColorA, t * 0.3);

  // Enhanced emissive brightness with HDR glow
  // Creates bloom-friendly over-bright values for post-processing
  float brightness = 0.8 + vGlow * 2.0 * uColorIntensity;

  // Neon tube effect: slight edge softening
  gl_FragColor = vec4(color * brightness, clamp(0.7 + t * 0.3, 0.0, 1.0));
}
