// ============================================================================
// TLALMANAC-X · Pollen FRAGMENT shader — "Color Shift & Glow"
// ----------------------------------------------------------------------------
// Colors each grain by how hard it is vibrating. At rest it reads as muted
// honey/pollen; under sonication it ignites toward a hot gold and emits light.
// ============================================================================

uniform vec3 uColorCalm;    // resting grain color (honey)
uniform vec3 uColorActive;  // energized grain color (ignited gold)

varying float vGlow;        // 0..1 oscillation energy from the vertex stage

void main() {
  // Remap glow with a gain of 1.5 then clamp → particles reach full "active"
  // color before peak swing, making the ignition feel snappy rather than linear.
  float t = clamp(vGlow * 1.5, 0.0, 1.0);

  // Linear interpolation: mix(a, b, t) = a·(1−t) + b·t.
  // t=0 → calm honey, t=1 → ignited gold.
  vec3 color = mix(uColorCalm, uColorActive, t);

  // Emissive brightness: a 0.6 ambient floor + up to 1.4 extra from vibration.
  // Values >1 push the grain into HDR-ish over-bright territory (bloom-friendly).
  float brightness = 0.6 + vGlow * 1.4;

  gl_FragColor = vec4(color * brightness, 1.0);
}
