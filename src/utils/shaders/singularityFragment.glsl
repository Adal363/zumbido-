// ============================================================================
// TLALMANAC-X · Singularity Fragment Shader
// Intensidad visual en el vórtice
// ============================================================================

uniform float uSingularityStrength;
varying float vDistortionFactor;
varying vec3 vWorldPos;

void main() {
  // Brillo central intenso, degradación suave hacia los bordes
  float brightness = vDistortionFactor * uSingularityStrength;
  
  // Color: transición de dorado a blanco intenso en el centro
  vec3 color = mix(
    vec3(1.0, 0.84, 0.0),        // Dorado #FFD700
    vec3(1.0, 1.0, 1.0),          // Blanco puro
    brightness
  );
  
  // Alpha: invisible en bordes, visible en centro
  float alpha = brightness * 0.6;
  
  gl_FragColor = vec4(color, alpha);
}
