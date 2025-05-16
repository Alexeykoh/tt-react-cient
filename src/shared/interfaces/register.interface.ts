import { z } from "zod";

export const registerRequestSchema = z
  .object({
    name: z.string().min(1, "Имя пользователя обязательно"),
    password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    email: z.string().email("Некорректный адрес электронной почты"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const registerResponseSchema = z.object({
  name: z.string(),
  email: z.string(),
  user_id: z.string(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
