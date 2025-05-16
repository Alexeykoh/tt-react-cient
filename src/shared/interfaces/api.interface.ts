import { z } from "zod";

// Схема для meta объекта
const PaginatedResponseMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// Универсальная функция для создания схемы PaginatedResponse с любым типом T
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: PaginatedResponseMetaSchema,
  });

// Тип для PaginatedResponse<T>
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
