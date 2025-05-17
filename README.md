# React + TypeScript + Vite

hello world
Этот шаблон предоставляет минимальную настройку для работы с React в Vite с поддержкой HMR и некоторыми правилами ESLint.

## Плагины

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) использует [Babel](https://babeljs.io/) для Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) использует [SWC](https://swc.rs/) для Fast Refresh

## Запуск проекта

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Запустите проект:
   ```bash
   npm run dev
   ```

## Структура проекта

Проект организован в соответствии с принципами Feature-Sliced Design (FSD), что позволяет улучшить модульность и масштабируемость приложения. Основные директории:

- `src/app`: Содержит глобальные настройки приложения, такие как маршрутизация и хранилище состояния.
- `src/features`: Содержит функциональные модули, такие как авторизация, которые могут быть переиспользованы в разных частях приложения.
- `src/entities`: Содержит бизнес-логические сущности, которые могут быть использованы в различных модулях.
- `src/shared`: Содержит общие модули и утилиты, которые могут быть использованы в любом месте приложения.
- `src/pages`: Содержит страницы приложения, каждая из которых может состоять из нескольких функциональных модулей.
- `src/widgets`: Содержит виджеты, которые представляют собой композиции из нескольких компонентов и могут быть использованы на страницах.

## Зависимости

### Основные зависимости

- `@reduxjs/toolkit`: Инструменты для работы с Redux.
- `react`: Библиотека для создания пользовательских интерфейсов.
- `react-dom`: Пакет для работы с DOM в React.
- `react-router-dom`: Маршрутизация для React.
- `tailwindcss`: Утилитарный CSS-фреймворк.
- `notistack`: Библиотека для отображения уведомлений.
- `js-cookie`: Работа с cookies.
- `jwt-decode`: Декодирование JWT токенов.

### Dev зависимости

- `vite`: Бандлер для разработки.
- `eslint`: Инструмент для анализа кода.
- `typescript`: Язык программирования с поддержкой типов.
- `vitest`: Фреймворк для тестирования.

## Tailwind CSS

Проект использует Tailwind CSS v4.0.17 - утилитарный CSS-фреймворк, который позволяет быстро создавать пользовательские интерфейсы с помощью предопределенных классов.

### Особенности конфигурации

- Используется новая цветовая модель OKLCH для определения цветов
- Поддержка темной и светлой темы через CSS-переменные
- Интеграция с библиотекой анимаций `tw-animate-css`
- Настроены базовые слои (layers) для стилизации элементов

### Утилиты

В проекте используется функция `cn` из `src/lib/utils.ts`, которая объединяет классы с помощью `clsx` и разрешает конфликты между классами Tailwind CSS с помощью `tailwind-merge`:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Эта функция позволяет эффективно комбинировать классы Tailwind CSS, особенно при создании компонентов с различными вариантами.

## shadcn/ui

Проект использует shadcn/ui v0.9.5 - коллекцию переиспользуемых компонентов, построенных на основе Radix UI и стилизованных с помощью Tailwind CSS.

### Конфигурация

Конфигурация shadcn/ui находится в файле `components.json`:

- Стиль: "new-york"
- Базовый цвет: "stone"
- Используются CSS-переменные
- Библиотека иконок: "lucide"

### Доступные компоненты

В проекте доступны следующие компоненты shadcn/ui:

- `Button`: Кнопка с различными вариантами (default, destructive, outline, secondary, ghost, link) и размерами (default, sm, lg, icon)
- `Card`: Компонент карточки для группировки контента
- `Form`: Компоненты для создания форм с использованием react-hook-form и zod для валидации
- `Input`: Компонент ввода текста
- `Label`: Компонент метки для форм

### Использование компонентов

Пример использования компонента Button:

```tsx
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <Button variant="outline" size="lg">
      Нажми меня
    </Button>
  )
}
```

Пример использования компонента Form с валидацией через zod:

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Имя пользователя должно содержать не менее 2 символов",
  }),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Обработка отправки формы
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя пользователя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Сохранить</Button>
      </form>
    </Form>
  )
}
```

Для добавления новых компонентов из библиотеки shadcn/ui можно использовать команду:

```bash
npx shadcn-ui@latest add [имя-компонента]
```

## Изменение логики

Для изменения логики авторизации и проверки токена, отредактируйте файлы:

- `src/shared/api/authApi.ts`
- `src/shared/api/baseQueryWithErrorHandling.ts`
- `src/app/router/PrivateRoute.tsx`

Для добавления новых функциональных модулей или страниц, создайте соответствующие файлы в директориях `src/features` или `src/pages`.
