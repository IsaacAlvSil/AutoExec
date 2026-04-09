# Usar imagen base de Node.js
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias globales y del proyecto
RUN npm install -g expo-cli
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Expo Web
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

# Comando por defecto para iniciar en modo web
CMD ["npm", "run", "web"]
