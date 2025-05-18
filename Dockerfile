# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Собираем проект
RUN npm run build

# Указываем порт, который будет использоваться
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
