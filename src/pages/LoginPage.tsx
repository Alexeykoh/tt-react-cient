import React from "react";
import LoginForm from "../features/auth/LoginForm";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h1 className="text-xl font-semibold">Авторизация</h1>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
