import React from "react";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
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

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [login,{isLoading: isLoadingLogin}] = useLoginMutation();
  const form = useForm({
    resolver: zodResolver(registerRequestSchema),
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const onSubmit = (data: RegisterRequest) => {
    register(data)
      .unwrap()
      .then(() => {
        login({ email: data.email, password: data.password })
          .unwrap()
          .then((data) => {
            Cookies.set("authToken", data.token);
            navigate(ROUTES.HOME);
          });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl className="w-full">
                <div className="relative w-full">
                  <Input
                    placeholder="username"
                    {...field}
                    defaultValue=""
                    className={"w-full pl-10"}
                    autoComplete="username"
                  />
                  <Avatar className="h-6 w-6 rounded-lg absolute bottom-1/2 translate-y-1/2 left-2">
                    <AvatarImage
                      src={getAvatarUrl(form.watch("name"))}
                      alt={"avatar"}
                    />
                    <AvatarFallback className="rounded-lg">
                      <Loader className="animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                </div>
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
        <Button disabled={isLoading} type="submit" className="mt-4 w-full">
          {isLoading || isLoadingLogin ? "Загрузка..." : "Зарегистрироваться"}
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
