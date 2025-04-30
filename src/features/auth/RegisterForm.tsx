import React, { useState } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
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
import { Eye, EyeOff, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/get-avatar-url";
import {
  registerRequestSchema,
  RegisterRequest,
} from "@/shared/interfaces/register.interface";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/shared/api/auth.service";
import { ROUTES } from "@/app/router/routes.enum";

interface ApiError {
  data?: {
    message?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const PasswordInput: React.FC<{
  label: string;
  name: "password" | "confirmPassword";
  control: Control<RegisterRequest>;
  error?: string;
}> = ({ label, name, control, error }) => {
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative flex items-center w-full">
              <Input
                {...field}
                type={show ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="pr-10 w-full"
                aria-invalid={!!error}
                aria-describedby={`${name}-error`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2"
                aria-label={show ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? (
                  <EyeOff size={18} className="text-muted-foreground" />
                ) : (
                  <Eye size={18} className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage id={`${name}-error`} />
        </FormItem>
      )}
    />
  );
};

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await register(data).unwrap();
      const loginData = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      Cookies.set("authToken", loginData.token);
      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (
        apiError?.data?.message &&
        typeof apiError.data.message === "string"
      ) {
        console.error("Ошибка:", apiError.data.message);
        // TODO: здесь можно показать уведомление пользователю с apiError.data.message
      } else {
        console.error("Неизвестная ошибка:", error);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Имя пользователя */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    {...field}
                    placeholder="username"
                    autoComplete="username"
                    aria-invalid={!!form.formState.errors.name}
                    aria-describedby="name-error"
                    className="pl-10 w-full"
                  />
                  <Avatar className="h-6 w-6 rounded-lg absolute left-2 top-1/2 -translate-y-1/2">
                    <AvatarImage
                      src={getAvatarUrl(form.watch("name"))}
                      alt="avatar"
                    />
                    <AvatarFallback className="rounded-lg">
                      <Loader className="animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </FormControl>
              <FormMessage id="name-error" />
            </FormItem>
          )}
        />

        {/* Электронная почта */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Электронная почта</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="example@example.com"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  aria-describedby="email-error"
                  className="w-full"
                />
              </FormControl>
              <FormMessage id="email-error" />
            </FormItem>
          )}
        />

        {/* Пароль */}
        <PasswordInput
          label="Пароль"
          name="password"
          control={form.control}
          error={form.formState.errors.password?.message}
        />

        {/* Подтверждение пароля */}
        <PasswordInput
          label="Подтвердите пароль"
          name="confirmPassword"
          control={form.control}
          error={form.formState.errors.confirmPassword?.message}
        />

        {/* Кнопка отправки */}
        <Button
          type="submit"
          disabled={isLoading || isLoadingLogin}
          className="w-full mt-4"
        >
          {(isLoading || isLoadingLogin) && (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isLoading || isLoadingLogin ? "Загрузка..." : "Зарегистрироваться"}
        </Button>

        {/* Ссылка на вход */}
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
