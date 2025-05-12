import {
  PaginatedResponse,
  PaginatedResponseSchema,
} from "@/shared/interfaces/api.interface";
import { enqueueSnackbar } from "notistack";
import { z, ZodSchema } from "zod";

/**
 * Универсальная функция для валидации данных по переданной схеме Zod.
 * @param schema - Схема Zod для валидации.
 * @param data - Данные для валидации (например, ответ сервера).
 * @throws Ошибка, если валидация не прошла.
 * @returns Валидированные данные с типом, выведенным из схемы.
 */
function validateWithSchema<T>(
  schema: ZodSchema<T>,
  data: T,
  name?: string
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Ошибка валидации:", name || "unknown", result.error);
    enqueueSnackbar("Ошибка валидации данных " + name || "unknown", {
      variant: "warning",
    });
    throw new Error("Ошибка валидации данных");
  }
  return result.data;
}

/**
 * Универсальная функция для валидации пагинированного ответа.
 * @param itemSchema - Схема Zod для элемента массива data.
 * @param data - Данные для валидации.
 * @param name - Опциональное имя для логов и сообщений.
 * @throws Ошибка, если валидация не прошла.
 * @returns Валидированные данные с типом PaginatedResponse<T>.
 */
function validatePaginatedResponse<T extends z.ZodTypeAny>(
  itemSchema: T,
  data: unknown,
  name?: string
): PaginatedResponse<z.infer<T>> {
  const schema = PaginatedResponseSchema(itemSchema);
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(
      "Ошибка валидации:",
      name || "PaginatedResponse",
      result.error
    );
    enqueueSnackbar(
      "Ошибка валидации данных " + (name || "PaginatedResponse"),
      {
        variant: "warning",
      }
    );
    throw new Error("Ошибка валидации данных");
  }


  return result.data;
}

export { validateWithSchema, validatePaginatedResponse };
