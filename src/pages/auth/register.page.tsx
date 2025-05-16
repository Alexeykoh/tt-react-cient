import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import RegisterForm from "@/features/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h1 className="text-xl font-semibold">Регистрация</h1>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
