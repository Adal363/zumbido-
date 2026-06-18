# Tlalmanac-X · El zumbido que nos une

Interactive sonication ecosystem for the *Bombus* (jicote) of Tlalmanalco.
Click & hold to "vibrate" — a 400 Hz sawtooth drives a 5,000-grain pollen
cloud that shimmers and ignites in real time via custom GLSL shaders.

## Stack
- **Vite** + **React 18** + **TypeScript** (strict)
- **React-Three-Fiber** / **three.js** — 3D scene & InstancedMesh
- **Tone.js** — Web Audio oscillator
- **Zustand** — single reactive store
- **vite-plugin-glsl** — `.glsl` imports as strings

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Architecture
```
index.html
vite.config.ts            # react + glsl plugins
tsconfig.json / .node.json
package.json
src/
  main.tsx                # mounts <App/>
  index.css               # global resets + fonts
  vite-env.d.ts           # *.glsl module typings
  App.tsx                 # orchestrator: input → store → scene/audio
  store/
    useEcosystemStore.ts  # Zustand: holding / audio / vibration / health / scroll
  hooks/
    useAudio.ts           # <AudioEngine/> — Tone.js sawtooth @ 400Hz
  components/
    Scene.tsx             # R3F Canvas: lights, camera, fog
    entities/
      PollenSystem.tsx    # InstancedMesh, 5000 reactive grains
  utils/
    shaders/
      pollenVertex.glsl   # sonic vibration (displacement)
      pollenFragment.glsl # color shift + glow
```

## Data flow
`mousedown` → `setUserHolding(true)` + gain/freq/vibration → store →
`AudioEngine` ramps gain, `PollenSystem` lerps `uVibration` into the shader →
grains oscillate & ignite. `mouseup` → `setUserHolding(false)` zeros gain &
vibration → smooth fade-out / settle.
