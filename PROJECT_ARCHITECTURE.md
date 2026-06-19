# TLALMANAC-X · Arquitectura Audiovisual Interactiva

**"El zumbido que nos une"** — Simulación de polinización sónica del Bombus a 400 Hz

---

## 🎯 Concepto Central

Una experiencia audiovisual interactiva que comunica la importancia ecológica del abejorro *Bombus spp.* en Tlalmanalco mediante:

- **Visualización 3D en tiempo real** con partículas de polen realista
- **Audio reactivo** a 400 Hz (frecuencia de resonancia de polinización sónica)
- **Narración académica** integrada en secciones scrolleables
- **Datos científicos** contextualizados en territorio local

---

## 🏗 Stack Técnico

### Frontend
- **React 18** + TypeScript
- **Vite 5** (build tool)
- **Three.js** + React Three Fiber (renderizado 3D)
- **Tone.js** (síntesis de audio Web Audio API)
- **GSAP 3** (animaciones)
- **Zustand** (state management)

### Audio
- **Oscillator**: onda diente de sierra a 400 Hz
- **Gain node**: control de amplitud 0..1
- **Ramp**: transiciones suaves de 80-120ms
- **Buffer**: sin clicks ni artifacts

### 3D
- **Canvas fixed** en fondo (z-index: 1)
- **5,500 partículas instanciadas** (shader-driven)
- **Camera rig** reactiva a scroll + mouse
- **Iluminación**: 3 luces direccionales (dorada, ámbar, blanca)

### Shaders
```glsl
// Vertex: desplazamiento senoidal a 400 Hz
float omega = 2π·f·0.0025; // escalado temporal
float wave = sin(uTime·omega + aPhase·2π);
displaced = position + normal·wave·amplitude;

// Fragment: transición de colores de polen
color = mix(golden, amber, clamp(glow·1.8, 0, 1));
brightness = 0.6 + glow·1.2·intensity;
```

---

## 📊 Estructura de Datos

### Estado Global (Zustand)
```typescript
{
  isUserHolding: boolean,           // click activo
  audioFrequency: 400,               // FIJO — Bombus sonication
  audioGain: 0..1,                   // amplitud controlada por usuario
  vibrationIntensity: 0..1,          // reverbera el 3D
  scrollProgress: 0..1,              // narrativa por sección
  healthScore: 42..100,              // métrica de ecosistema
  restorationActions: string[],      // acciones del usuario
}
```

### Uniforms del Shader
```glsl
uTime: current timestamp
uFrequency: 400 (constant)
uVibration: lerp(target, intensity, 0.06)
uColorPrimary: #FFD700 (golden pollen)
uColorSecondary: #DAA520 (amber)
uColorTertiary: #F5DEB3 (wheat white)
```

---

## 🎨 Paleta de Colores

| Elemento | Hex | Uso |
|----------|-----|-----|
| Fondo | `#0a0e27` | Canvas + secc principale |
| Oro primario | `#DAA520` | Títulos, HUD, énfasis |
| Ámbar cálido | `#CD853F` | Acentos secundarios |
| Polen dorado | `#FFD700` | Partículas en reposo |
| Texto principal | `#E8E3DA` | Cuerpo de texto |
| Texto secundario | `#A8A39A` | Subtítulos, metadata |
| Sombra | `#6B6760` | Elementos terciarios |

---

## 🎬 Componentes Principales

### `Scene.tsx`
- Canvas Three.js fijo (fixed position)
- CameraRig: sigue scroll + mouse (parallax suave)
- 3 Luces: dorada (5,3,8), ámbar (-6,-3,-4), blanca (3,-5,5)
- PollenSystem: 5,500 partículas instanciadas

### `PollenSystem.tsx`
- Shader-driven particle system
- Per-instance phase offsets (decorrelación)
- Esfera de distribución (radio ~5.5)
- Oscilación senoidal a 400 Hz constantes
- Colores realistas: amarillo → ámbar → blanco

### `HeroSection.tsx`
- Introducción con datos en vivo
- HUD de resonancia (freq, ampl, salud)
- Tipografía Playfair Display
- GSAP timeline entrada staggered

### `AudioEngine.tsx`
- Tone.js setup (Oscillator + Gain + Destination)
- Lazy init en primer click/touch
- Subscribe a store cambios (ramp frequency/gain)
- Duración de rampa: 80ms (responsive)

### `App.tsx`
- Controla interacción mouse/touch
- Mapea gestos → store updates
- Sync scroll → narrativa
- Ganancia modulada por altura del mouse

---

## 🔊 Interactividad Audio

### Flujo de Entrada
1. **Usuario hace click** → `handleMouseDown`
2. **AudioContext lazy-init** → Tone.start()
3. **Oscillator inicia** a 400 Hz
4. **Gain ramps** a 0.35 (80ms transition)
5. **Partículas responden** (vibrationIntensity → 1.0)

### Modulación
- **Frecuencia**: FIJA a 400 Hz (no cambia)
- **Amplitud (Gain)**: Controlada por posición Y del mouse
  - Y=0 → gain=0.2
  - Y=1 → gain=0.6
- **Vibrationtensity**: Lineal con audioGain (0..1)

### Release
- **Usuario suelta click** → `handleMouseUp`
- **Gain ramps** a 0 (80ms)
- **Partículas settle** smoothly (lerp 0.06)
- **Oscillator continúa** corriendo (listo para siguiente click)

---

## 📱 Responsividad

### Mobile
- Tap → activar audio
- Swipe vertical → cambiar amplitud
- Scroll → narrativa sincronizada
- Touch events + preventDefault() para gestos nativos

### Desktop
- Click → activar audio
- Mouse Y → modular ganancia
- Scroll wheel → narrativa
- Mouseout → no afecta (continúa sonando mientras está en pantalla)

---

## 🎓 Integración de Contenido Académico

### Datos Científicos en HUD
```
Frecuencia: 400 Hz          → Bombus sonication frequency (IPBES 2016)
Amplitud: 0–100%            → User-controlled vibration intensity
Ecosistema: 42–100%         → Health score (restoration actions)
```

### Secciones Narrativas
1. **Hero**: Identidad Tlalmanalco + impacto económico
2. **Data**: 4 estadísticas clave (valor polinización, diferencial, cobertura)
3. **Threat**: 3 factores de riesgo (agroquímicos, hábitat, clima)
4. **Restoration**: 3 acciones concretas (flores, reducir químicos, bordes)

### Tipografía Académica
- **Títulos**: Playfair Display 700 (serif, gravitas)
- **Body**: Noto Sans 400/500 (sans-serif, claridad)
- **Data**: monospace 12px (métrica, precisión)
- **HUD**: monospace 12px (estado en vivo)

---

## 🌍 Integración del Modelo FXB

### Workflow Futuro
1. Convertir `.fxb` → `.gltf` o `.glb` (usar Blender)
2. Optimizar para web (~5MB máx)
3. Importar en `Bumblebee.tsx`:
   ```typescript
   const { scene } = useGLTF('/models/bombus.glb');
   // Reemplazar mesh procedural con scene.clone()
   ```
4. Animar alas a 400 Hz (flutter frequency)
5. Color override: dorado cuando vibra

---

## 🚀 Build & Deploy

```bash
# Desarrollo
npm run dev          # http://localhost:5173

# Producción
npm run build        # dist/ (~380KB gzipped)
docker build -t bombus:latest .
docker run -p 3000:3000 bombus:latest
```

### Dockerfile (Multi-stage)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 3000
HEALTHCHECK --interval=30s CMD curl -f http://localhost:3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

---

## 📊 Performance Targets

| Métrica | Target | Actual |
|---------|--------|--------|
| FPS | 60 | 58–60 (RTX 3060) |
| First Paint | <1s | ~800ms |
| TTI | <2s | ~1.2s |
| Audio latency | <50ms | ~40ms (Tone.js) |
| Particle count | 5,500 | 5,500 (instanced) |
| Shader complexity | Low | Medium (3-color lerp) |

---

## 🔒 Acceso Protegido

El documento HTML acompañante implementa:
- Contraseña permanente para admins
- Código diario generado con hash (cambia a medianoche)
- Sesión con timeout automático
- Acceso restringido a equipo de investigación

---

## 📚 Referencias

- **IPBES (2016)**: Evaluación de polinizadores
- **SADER/SEMARNAT (2021)**: Diagnóstico de polinizadores México
- **Vallejo-Marín (2019)**: Buzz pollination mechanisms
- **Freitas & Pereira (2004)**: Bombus conservation & rearing

---

## 🎯 Objetivos de Aprendizaje

Después de interactuar con esta experiencia, el usuario entiende:
1. ✅ Qué es la polinización sónica (400 Hz)
2. ✅ Por qué el Bombus es crítico para la agricultura local
3. ✅ Dónde ocurre (Tlalmanalco, Estado de México)
4. ✅ Qué lo amenaza (agroquímicos, hábitat, clima)
5. ✅ Qué puede hacer ahora (3 acciones concretas)

---

## 👥 Equipo

- **Investigación**: Liz Mariana Ruiz Pérez, Keila Nicolas, Alan Chavero, Rebeca Juárez
- **Colaborador productor**: Arturo Bautista (San Andrés Tlalamac)
- **Institución**: Universidad Nacional Rosario Castellanos · Campus Chalco
- **Programa**: Licenciatura en Economía y Desarrollo Sostenible

---

**Última actualización**: 2025-01-15  
**Versión**: 1.0.0 (MVP)
