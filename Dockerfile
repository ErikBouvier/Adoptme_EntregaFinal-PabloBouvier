# Usa una imagen base ligera de Node.js
FROM node:18-alpine

# crea el directorio de la app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm ci --only=production

# Copiar el resto de los archivos de la aplicación
COPY . .

# Crear un usuario no root para ejecutar la aplicación
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app

# Cambia al usuario no root
USER nodejs

# Expone el puerto que usará la app
EXPOSE 8080

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]
