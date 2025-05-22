"Разработай приложение на React с использованием TypeScript, Redux Toolkit (RTK), RTK Query, React Router и React Hook Form. Придерживайся методологии FSD (Feature-Sliced Design) для архитектуры проекта. Соблюдай следующие требования:

Типизация:

Не используй тип any. Все сущности должны быть строго типизированы.

Интерфейсы, типы и enum размещай в отдельных файлах (types.ts, interfaces.ts, enums.ts) в соответствующих слоях FSD.

Структура проекта (FSD):

Copy
src/
  app/
    store.ts          # Конфигурация хранилища RTK
  pages/
    Home.page.tsx     # Страницы с суффиксом .page.tsx
  widgets/
    UserList/        # Виджеты (составные компоненты)
  features/
    auth/           # Фичи (логика авторизации)
      lib/
      model/
        user.service.ts  # API-запросы через RTKQ
        auth.slice.ts    # Слайсы RTK
      ui/
  entities/
    user/           # Сущности (базовые компоненты)
  shared/
    api/            # Общие API-настройки RTKQ
    lib/            # Хелперы, утилиты
    ui/             # UI-кит (кнопки, инпуты)
    types/          # Глобальные типы
Redux Toolkit & RTK Query:

Слайсы именуй по шаблону [feature].slice.ts (например: auth.slice.ts).

API-сервисы RTKQ именуй как [feature].service.ts (например: user.service.ts).

Используй createApi для запросов к бэкенду.

React Router:

Реализуй роутинг с ленивой загрузкой (lazy).

Защищённые маршруты (PrivateRoute) для авторизованных пользователей.

React Hook Form:

Для форм используй useForm с валидацией через Zod или Yup.

Типизируй все поля формы.

Компоненты:

Создавай компоненты как функции: function Component(), а не const Component = () =>.

Используй кастомные хуки для бизнес-логики (например: useAuth()).