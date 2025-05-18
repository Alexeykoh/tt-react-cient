# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Кэширование зависимостей
COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline --no-audit

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]