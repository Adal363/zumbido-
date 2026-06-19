// ============================================================================
// TLALMANAC-X · Singularity Vortex Shader
// "Black Hole Effect" — Partículas de polen atraídas hacia el centro
// Basado en conceptos de distorsión gravitacional
// ============================================================================

uniform vec3 uSingularityPos;      // Centro del vórtice (mundo)
uniform float uSingularityStrength; // Fuerza de atracción (0..1)
uniform float uTime;               // Para animación suave
uniform float uVortexRadius;       // Radio de influencia

varying float vDistortionFactor;
varying vec3 vWorldPos;

void main() {
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vWorldPos = worldPos;
  
  // Vector desde la partícula hacia la singularidad
  vec3 toSingularity = uSingularityPos - worldPos;
  float distToCenter = length(toSingularity);
  float distanceFactor = 1.0 - smoothstep(0.0, uVortexRadius, distToCenter);
  
  // Desplazamiento orbital suave
  vec3 orbitDir = normalize(cross(toSingularity, vec3(0.0, 1.0, 0.0)));
  float orbitStrength = sin(uTime * 2.0 + distToCenter * 3.0) * 0.15;
  
  // Atracción hacia el centro
  vec3 attractionForce = normalize(toSingularity) * 
                         distanceFactor * 
                         uSingularityStrength * 0.3;
  
  // Posición final desplazada
  vec3 displacedPos = position + 
                      attractionForce + 
                      orbitDir * orbitStrength * distanceFactor;
  
  vDistortionFactor = distanceFactor;
  
  vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
