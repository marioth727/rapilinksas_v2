# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Copiar solo lo necesario para instalar dependencias primero (cacheo de Docker)
COPY package*.json ./
RUN npm install

# Copiar el resto y construir
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine

# Copiar la build de Vite del Stage 1 al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
