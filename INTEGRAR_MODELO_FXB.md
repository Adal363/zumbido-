# Cómo integrar el modelo FXB del Abejorro

## 📋 Pasos para integración del modelo 3D

### 1. Preparar el archivo FXB

El archivo `.fxb` es un formato propietario de Autodesk Maya. Para usarlo en Three.js, convértelo a **GLTF/GLB**:

```bash
# Opción A: Usar Blender (recomendado)
# 1. Abre Blender
# 2. File > Import > Autodesk FBX (.fbx)
#    (Nota: si es .fxb, primero renómbralo a .fbx)
# 3. File > Export > glTF 2.0 (.glb/.gltf)
# 4. Optimiza: desactiva Animations si no necesitas, aplica Draco compression

# Opción B: Usar conversores online
# - https://products.aspose.app/3d/conversion/fbx-to-gltf
# - https://convertio.co/fbx-gltf/
```

### 2. Copiar el modelo al proyecto

```bash
# Copia el archivo .glb al directorio de assets
cp bombus.glb "C:\Users\adalr\Downloads\Componente App.tsx generado\public\models\bombus.glb"

# O crea la carpeta si no existe
mkdir -p "public/models"
```

### 3. Cargar el modelo en el componente Bumblebee

Reemplaza el contenido de `src/components/Bumblebee.tsx`:

```typescript
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEcosystemStore } from '../store/useEcosystemStore';

interface BumblebeeProps {
  position?: [number, number, number];
}

const Bumblebee: React.FC<BumblebeeProps> = ({ position = [0, 2, 0] }) => {
  const { scene: modelScene, animations } = useGLTF('/models/bombus.glb');
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isUserHolding = useEcosystemStore((s) => s.isUserHolding);
  const vibrationIntensity = useEcosystemStore((s) => s.vibrationIntensity);

  // Clonar el modelo para evitar mutaciones
  const clonedScene = React.useMemo(() => {
    if (!modelScene) return null;
    const cloned = modelScene.clone();
    
    // Aplicar color dorado cuando vibra
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: hovered || isUserHolding ? '#FFD700' : '#8B7500',
          emissive: hovered ? '#DAA520' : '#000000',
          emissiveIntensity: hovered ? 0.8 : isUserHolding ? vibrationIntensity : 0,
          metalness: 0.4,
          roughness: 0.3,
        });
      }
    });
    
    return cloned;
  }, [modelScene, hovered, isUserHolding, vibrationIntensity]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Rotación suave
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
    groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 1.2) * 0.06;

    // Flotación durante vibración
    if (isUserHolding) {
      groupRef.current.position.y = 
        position[1] + Math.sin(clock.getElapsedTime() * 5) * 0.25 * vibrationIntensity;
    }

    // Escala pulsante con vibración
    const pulse = 1 + (isUserHolding ? Math.sin(clock.getElapsedTime() * 8) * 0.1 * vibrationIntensity : 0);
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {clonedScene && (
        <primitive object={clonedScene} />
      )}
    </group>
  );
};

export default Bumblebee;

// Pre-cargar el modelo
useGLTF.preload('/models/bombus.glb');
```

### 4. Agregar el Bumblebee a la Scene

Edita `src/components/Scene.tsx` e importa y renderiza el componente:

```typescript
import Bumblebee from './Bumblebee';

const Lights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 3, 8]} intensity={1.5} color="#DAA520" />
      <pointLight position={[-6, -3, -4]} intensity={1.2} color="#CD853F" />
      <pointLight position={[3, -5, 5]} intensity={0.8} color="#F5DEB3" />
    </>
  );
};

const Scene: React.FC = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 100 }}>
        <color attach="background" args={['#0a0e27']} />
        <fog attach="fog" args={['#0a0e27', 8, 20]} />
        
        <Lights />
        <CameraRig />
        <PollenSystem count={5500} />
        
        {/* ← AGREGAR AQUÍ */}
        <Bumblebee position={[0, 1.5, 0]} />
      </Canvas>
    </div>
  );
};
```

### 5. Instalar dependencia de loader

```bash
npm install @react-three/drei
```

### 6. Optimizaciones Importantes

#### Tamaño del modelo
- Asegúrate que el GLB sea < 5MB
- En Blender: Use **Draco compression** (reduce ~70%)
- Decimat the mesh si tiene > 100k vértices

#### Materiales
- Si el modelo viene con texturas, úsalas pero aplica tint de color:
```typescript
if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
  child.material.color.setHex(0xFFD700); // Overlay dorado
  child.material.emissiveIntensity = 0.6;
}
```

#### Animaciones
- Si el GLB contiene animaciones (alas):
```typescript
const mixer = new THREE.AnimationMixer(clonedScene);
const wingFlap = mixer.clipAction(animations[0]); // asuming first clip es alas
wingFlap.play();

// En useFrame:
mixer.update(delta);
```

---

## 🎨 Adaptación de materiales al ciclo de vibración

El Bumblebee responde a 3 estados:

| Estado | Color | Emisión | Escala |
|--------|-------|---------|--------|
| **Reposo** | #8B7500 (marrón oscuro) | 0 | 1.0 |
| **Hover** | #FFD700 (dorado) | 0.8 | 1.0 |
| **Vibración** | #FFD700 (dorado) | vibrationIntensity | 1 + sin(t)·0.1·vibration |

---

## ✅ Checklist

- [ ] Convertir FXB → GLB (Blender)
- [ ] Optimizar tamaño (<5MB)
- [ ] Copiar a `public/models/bombus.glb`
- [ ] Instalar `@react-three/drei`
- [ ] Actualizar `Bumblebee.tsx` con useGLTF
- [ ] Agregar `<Bumblebee />` a Scene
- [ ] Testear carga en navegador (DevTools > Network)
- [ ] Verificar animaciones y materiales
- [ ] Build y deploy

---

## 🐛 Troubleshooting

### "Module not found: '@react-three/drei'"
```bash
npm install --save @react-three/drei
```

### Modelo carga lentamente
- Verificar tamaño GLB: `ls -lh public/models/bombus.glb`
- Aplicar Draco compression en Blender
- Usar `.glb` en lugar de `.gltf` (binario, más compacto)

### Materiales se ven mal
- Verificar que no hay texturas faltantes
- Aumentar `ambientLight intensity` a 0.7–0.8
- Aplicar emissive map si el modelo lo tiene

### Animaciones no funcionan
```typescript
const [mixer] = useState(() => new THREE.AnimationMixer(clonedScene));

useFrame((_, delta) => {
  mixer.update(delta);
  // resto del código...
});
```

---

## 📚 Referencias

- [Three.js glTF Loader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [React Three Fiber useGLTF](https://docs.pmnd.rs/react-three-fiber/basics/loading-models)
- [Blender FBX Export](https://docs.blender.org/manual/en/latest/addons/import_export/scene_fbx.html)
- [Draco Compression](https://google.github.io/draco/)

---

**Cuando tengas el GLB listo, ejecuta `npm run build` y prueba en desarrollo con `npm run dev`.**
