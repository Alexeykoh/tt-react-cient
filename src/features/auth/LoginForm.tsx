import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/shared/api/auth.service";
import { ROUTES } from "@/app/router/routes.enum";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";

const loginSchema = z.object({
  email: z.string().email("Неверный формат email").min(1, "Email обязателен"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
});

const plansDefault = {
  [SUBSCRIPTION.FREE]: {
    email: "free@example.com",
    password: "password123",
  },
  [SUBSCRIPTION.PREMIUM]: {
    email: "premium@example.com",
    password: "password123",
  },
  [SUBSCRIPTION.BASIC]: { email: "basic@example.com", password: "password123" },
};

const LoginForm: React.FC = () => {
  const [defaultUser, setDefaultUser] = useState<SUBSCRIPTION>(
    SUBSCRIPTION.FREE
  );
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: plansDefault[defaultUser].email,
      password: plansDefault[defaultUser].password,
    },
  });

  const navigate = useNavigate();
  const { handleSubmit } = form;
  const [login, { data, error, isLoading }] = useLoginMutation();

  const onSubmit = async (data: { email: string; password: string }) => {
    login(data);
  };

  useEffect(() => {
    if (data) {
      Cookies.set("authToken", data.token);
      navigate(ROUTES.HOME);
    }
  }, [data, error]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Select
        onValueChange={(data: SUBSCRIPTION) => {
          setDefaultUser(data);
          form.setValue("email", plansDefault[data].email);
          form.setValue("password", plansDefault[data].password);
        }}
        value={defaultUser}
        defaultValue={defaultUser}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите клиента (опционально)" />
        </SelectTrigger>

        <SelectContent>
          {Array.from(Object.values(SUBSCRIPTION)).map((el) => (
            <SelectItem key={el} value={el}>
              {el}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FormProvider {...form}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              {/* <FormDescription>Введите ваш email адрес.</FormDescription> */}
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
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormProvider>
      <Button disabled={isLoading} type="submit" className="mt-4 w-full">
        {isLoading ? "Загрузка..." : "Войти"}
      </Button>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Еще нет аккаунта?{" "}
          <Button variant="link" className="p-0" asChild>
            <Link to="/auth/sign-up">Зарегистрироваться</Link>
          </Button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
