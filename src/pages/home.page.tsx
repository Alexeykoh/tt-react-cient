import ClientItem from "@/components/client-item";
import RateItem from "@/components/rate-item";
import TaskItem from "@/components/task-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearcV2Query } from "@/shared/api/search.service";
import { SUNSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import PrivateComponent from "@/widgets/private-component";
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: searchData } = useSearcV2Query({ searchLocation: "all" });
  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
      <div className="flex flex-wrap justify-between gap-2">
        <h1 className="text-2xl font-bold mb-4">Главная</h1>
      </div>

      <div className="flex flex-col gap-4 w-full pb-6">
        <h2 className="text-xl">Последние задачи</h2>
        <div className="flex flex-wrap gap-4 w-full">
          {searchData?.tasks?.map((el) => (
            <Card key={el?.task_id} className="min-w-64 w-full md:w-fit">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TaskItem showTime={false} task_id={el?.task_id || ""} />
                  <CardTitle>{el?.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <RateItem
                  symbol={el?.currency?.symbol}
                  rate={el?.rate}
                  payment_type={el?.payment_type}
                />
              </CardContent>
              <CardFooter className="space-x-2">
                <Button
                  onClick={() =>
                    navigate("/projects/" + el?.project?.project_id)
                  }
                >
                  Перейти
                </Button>
                <PrivateComponent
                  subscriptions={[SUNSCRIPTION.BASIC, SUNSCRIPTION.PREMIUM]}
                >
                  <Button
                    variant={"outline"}
                    onClick={() => navigate("/tasks/" + el?.task_id)}
                  >
                    Статистика
                  </Button>
                </PrivateComponent>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full pb-6">
        <h2 className="text-xl">Последние проекты</h2>
        <div className="flex flex-wrap gap-4 w-full">
          {searchData?.projects?.map((el) => (
            <Card key={el?.project_id} className="min-w-64 w-full md:w-fit">
              <CardHeader>
                <CardTitle>{el?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ClientItem
                  name={el?.client?.name}
                  contact_info={el?.client?.contact_info}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/projects/" + el?.project_id)}>
                  Перейти
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
