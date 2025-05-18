# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production image with Nginx
FROM nginx:alpine

# Копируем собранную статику в стандартную директорию nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx, если потребуется (опционально)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
