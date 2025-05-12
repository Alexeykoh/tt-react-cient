import { z } from "zod";

export const UserSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  avatar: z.string().optional(),
});

export const EditUserNameSchema = z.object({
  name: z
    .string()
    .min(1, "Имя пользователя обязательно")
    .regex(/^\S/, "Имя не должно начинаться с пробела")
    .regex(/^(?!.*\s\s)/, "Имя не должно содержать два пробела подряд"),
});

export const AuthResponseSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type EditUserNameDTO = z.infer<typeof EditUserNameSchema>;
