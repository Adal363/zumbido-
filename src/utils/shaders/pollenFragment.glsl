// ============================================================================
// TLALMANAC-X · Pollen FRAGMENT shader — "Realistic Pollen Grains"
// 
// Partículas de polen dorado/ámbar que vibran a 400 Hz
// Colores naturales: amarillo polen, ámbar cálido, blanco translúcido
// ============================================================================

uniform vec3 uColorPrimary;     // Amarillo dorado del polen
uniform vec3 uColorSecondary;   // Ámbar cálido
uniform vec3 uColorTertiary;    // Blanco translúcido
uniform float uColorIntensity;  // Master glow intensity (0..2)
uniform float uTime;            // Para animación suave

varying float vGlow;            // Oscilación desde vertex shader

void main() {
  // Remap glow con control suave — evita picos duros
  float t = clamp(vGlow * 1.8, 0.0, 1.0);

  // Mezcla de tres colores de polen: dorado → ámbar → blanco
  vec3 color;
  if (t < 0.5) {
    // Dorado a ámbar
    color = mix(uColorPrimary, uColorSecondary, t * 2.0);
  } else {
    // Ámbar a blanco
    color = mix(uColorSecondary, uColorTertiary, (t - 0.5) * 2.0);
  }

  // Brillo con efecto de translucidez natural
  // Mínimo 0.5 en reposo, máximo 1.8 cuando vibra
  float brightness = 0.6 + vGlow * 1.2 * uColorIntensity;

  // Alpha: partículas más visibles cuando vibran
  float alpha = 0.4 + t * 0.6;

  gl_FragColor = vec4(color * brightness, alpha);
}
