import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/get-avatar-url";

const registerSchema = z
  .object({
    username: z.string().min(1, "Имя пользователя обязательно"),
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

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const RegisterForm: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Form Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={getAvatarUrl(form.watch("username"))}
            alt={"avatar"}
          />
          <AvatarFallback className="rounded-lg">
            <Loader className="animate-spin" />
          </AvatarFallback>
        </Avatar>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl style={{ width: "100%" }}>
                <Input
                  placeholder="username"
                  {...field}
                  defaultValue=""
                  style={{ width: "100%" }}
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Электронная почта</FormLabel>
              <FormControl style={{ width: "100%" }}>
                <Input
                  type="email"
                  placeholder="example@example.com"
                  {...field}
                  defaultValue=""
                  style={{ width: "100%" }}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Input
                    type={showPassword.password ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    defaultValue=""
                    style={{ width: "100%" }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onMouseDown={() =>
                      setShowPassword({ ...showPassword, password: true })
                    }
                    onMouseUp={() =>
                      setShowPassword({ ...showPassword, password: false })
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "8px",
                    }}
                  >
                    {showPassword.password ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите пароль</FormLabel>
              <FormControl style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    defaultValue=""
                    style={{ width: "100%" }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onMouseDown={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: true,
                      })
                    }
                    onMouseUp={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: false,
                      })
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "8px",
                    }}
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4 w-full">
          Зарегистрироваться
        </Button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Button variant="link" className="p-0" asChild>
              <Link to="/auth/sign-in">Войти</Link>
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
