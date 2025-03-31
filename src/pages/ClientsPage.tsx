import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const ClientsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
      <Card>
        <CardContent>
          <p>Страница клиентов</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsPage;
