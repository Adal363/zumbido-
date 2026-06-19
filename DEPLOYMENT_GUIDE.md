# 🚀 DEPLOYMENT GUIDE — "El zumbido que nos une"

## 📦 Status Actual

✅ **Build exitoso**  
✅ **Modelo 3D integrado** (bombus.glb)  
✅ **Servidor dev corriendo** (http://localhost:5173 + network)  
✅ **Optimizado para producción**  

---

## 🌐 Opción 1: Deploy en Vercel (RECOMENDADO)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Autenticarse
```bash
vercel login
# Te pedirá email + confirmación
```

### 3. Deployar
```bash
cd "C:\Users\adalr\Downloads\Componente App.tsx generado"
vercel
# Selecciona:
# - Project name: tlalmanac-x (o tu preferencia)
# - Framework: Vite
# - Deploy dist/: Yes
```

### 4. Resultado
URL pública: **https://tlalmanac-x.vercel.app** (o similar)

---

## 🐳 Opción 2: Deploy con Docker

### 1. Build imagen
```bash
cd "C:\Users\adalr\Downloads\Componente App.tsx generado"
docker build -t bombus:latest .
```

### 2. Ejecutar localmente
```bash
docker run -p 3000:3000 bombus:latest
# Abre http://localhost:3000
```

### 3. Deploy en servicio (AWS, DigitalOcean, etc.)
```bash
# 1. Push a Docker Hub
docker tag bombus:latest tuusuario/bombus:latest
docker push tuusuario/bombus:latest

# 2. En tu servidor:
docker pull tuusuario/bombus:latest
docker run -d -p 80:3000 \
  --restart=always \
  --name bombus \
  tuusuario/bombus:latest
```

---

## 📱 Opción 3: Deploy en Railway (Simple)

### 1. Conectar GitHub
- Push este proyecto a GitHub
- Ir a https://railway.app
- Conectar repo

### 2. Configurar environment
```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096
```

### 3. Deploy
Railway detecta Dockerfile automáticamente y deploya.

---

## ☁️ Opción 4: Deploy en Netlify

### 1. Conectar repo GitHub
```
Ir a https://app.netlify.com
Conectar repo
```

### 2. Build settings
```
Build command: npm run build
Publish directory: dist
```

### 3. Deploy
Netlify deploya automáticamente.

---

## 🔧 Optimizaciones Pre-Deploy

### 1. Comprimir GLB (opcional, ya está optimizado)
```bash
# Si quieres reducir aún más:
gltf-transform compress public/models/bombus.glb public/models/bombus.glb
```

### 2. Verificar tamaño
```bash
# Debe ser ~26 MB (dentro de límites)
ls -lh public/models/bombus.glb
```

### 3. Build final
```bash
npm run build
# Verifica tamaño de dist/
# Debe ser ~1.4 MB (gzipped)
```

---

## 📊 URLs de Monitoreo

Una vez deployado, puedes monitorear:

- **Performance**: https://www.webpagetest.org/
- **Lighthouse**: Chrome DevTools (F12 → Lighthouse)
- **Analytics**: Agregar Google Analytics (opcional)

---

## 🎯 Checklist Pre-Deploy

- [ ] `npm run build` exitoso
- [ ] No hay errores en console
- [ ] GLB carga correctamente
- [ ] Partículas visibl es
- [ ] Audio funciona (400 Hz)
- [ ] Vórtex aparece con vibración
- [ ] HUD datos en vivo
- [ ] Scroll narrativa sincronizado
- [ ] Mobile responsive
- [ ] Vercel.json configurado
- [ ] Dockerfile testado

---

## 🚀 PASO A PASO VERCEL (Lo más fácil)

```bash
# 1. Instalar
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd "C:\Users\adalr\Downloads\Componente App.tsx generado"
vercel

# 4. Responder preguntas:
# Scope? → Dejar default (tu cuenta)
# Link existing? → N
# Project name? → tlalmanac-x
# Confirm? → Y
# Framework? → Vite
# Publish? → Y (deploy dist/)
# Build? → Y

# 5. ¡LISTO! URL: https://tlalmanac-x.vercel.app
```

---

## 🔐 Variables de Entorno (si necesita)

Si quieres agregar analytics o configuración:

```bash
# En Vercel dashboard:
# Settings → Environment Variables
# Agregar:
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_KEY=xxx
```

---

## 📞 Troubleshooting

### "Build failed"
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### "Model not loading"
```bash
# Verifica que bombus.glb esté en public/models/
# La URL debe ser /models/bombus.glb (relativa)
```

### "Slow on mobile"
```bash
# Reduce partículas en src/components/Scene.tsx
# PollenSystem count={3000}  (en lugar de 5500)
# SingularityVortex count={1000}  (en lugar de 2000)
```

### "Audio no suena"
```bash
# Algunos navegadores requieren user gesture primero
# Asegúrate de hacer click antes de que reproduzca
# Verifica console (F12 → Console)
```

---

## 🎉 ¡SUCCESS!

Una vez deployado:

1. Comparte la URL pública
2. Abre en navegador
3. Haz clic fuerte
4. Disfruta del vórtex de polen 🌀✨

---

## 📚 Referencias Rápidas

| Plataforma | Tiempo Setup | Costo | Facilidad |
|-----------|-------------|-------|-----------|
| Vercel | 5 min | Free (hasta 100GB) | ⭐⭐⭐⭐⭐ |
| Netlify | 5 min | Free (hasta 300 builds) | ⭐⭐⭐⭐⭐ |
| Railway | 10 min | Pago (primero free) | ⭐⭐⭐⭐ |
| Docker + VPS | 30 min | ~$5–10/mes | ⭐⭐⭐ |

---

**Recomendación: Usa VERCEL — es el más rápido y fácil.** 🚀
