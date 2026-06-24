# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx para servir los archivos estáticos
FROM nginx:alpine
# Eliminar la página de bienvenida por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/Multiservicio_rafael/browser /usr/share/nginx/html
# Copiar el archivo index.csr.html (generado por Angular SSR) como index.html
RUN cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html || true
EXPOSE 80
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
