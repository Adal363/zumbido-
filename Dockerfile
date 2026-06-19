FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Build
RUN npm run build

# Stage de producción
FROM node:20-alpine

WORKDIR /app

# Instalar serve para servir archivos estáticos
RUN npm install -g serve

# Copiar dist desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para servir
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard", "--single"]
