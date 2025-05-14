import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import ClientItem from "@/components/client-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearcV2Query } from "@/shared/api/search.service";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AdvantageCard } from "@/shared/ui/AdvantageCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRef, useEffect, useState } from "react";
import TaskCardMain from "@/features/tasks/task-cards/task-card-main.root";

const TASK_ADVANTAGES = [
  {
    title: "Быстрый старт",
    description:
      "Создайте первую задачу и начните эффективно управлять своими проектами.",
  },
  {
    title: "Удобная организация",
    description:
      "Группируйте задачи, отслеживайте прогресс и повышайте продуктивность.",
  },
  {
    title: "Контроль сроков",
    description: "Следите за дедлайнами и не пропускайте важные этапы.",
  },
  {
    title: "Приоритеты",
    description:
      "Устанавливайте приоритеты для эффективного распределения ресурсов.",
  },
  {
    title: "Коллаборация",
    description: "Назначайте задачи участникам команды и работайте вместе.",
  },
  {
    title: "История изменений",
    description: "Отслеживайте все изменения и комментарии по задачам.",
  },
];

const PROJECT_ADVANTAGES = [
  {
    title: "Стартуйте новый проект",
    description:
      "Создайте проект для централизованного управления задачами и командой.",
  },
  {
    title: "Аналитика и контроль",
    description:
      "Получайте статистику по проектам и принимайте решения на основе данных.",
  },
  {
    title: "Гибкое управление",
    description: "Настраивайте этапы, статусы и роли под ваши бизнес-процессы.",
  },
  {
    title: "Совместная работа",
    description:
      "Приглашайте коллег, распределяйте задачи и достигайте целей вместе.",
  },
  {
    title: "История изменений",
    description:
      "Вся история изменений и активности по проекту всегда под рукой.",
  },
  {
    title: "Безопасность данных",
    description:
      "Ваши проекты и информация защищены и доступны только вашей команде.",
  },
];

type Advantage = { title: string; description: string };

function AdvantageCarousel({ items }: { items: Advantage[] }) {
  const [, setActive] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Автопрокрутка
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length]);

  // Loop: если вручную листают, сбрасываем таймер
  const handleManual = (idx: number) => {
    setActive(idx);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, 10000);
    }
  };

  // Для бесконечности: дублируем массив если карточек мало
  const slides = items.length < 4 ? [...items, ...items] : items;

  return (
    <Carousel
      className="w-full max-w-full"
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent className="gap-x-4">
        {slides.map((item, idx) => (
          <CarouselItem
            key={item.title + idx}
            className="basis-72 md:basis-64 flex-shrink-0"
            style={{ minHeight: 220, height: "100%" }}
            onClick={() => handleManual(idx % items.length)}
          >
            <AdvantageCard title={item.title} description={item.description} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: projectsData } = useSearcV2Query({
    searchLocation: "projects",
  });
  const { data: tasksData } = useSearcV2Query({ searchLocation: "tasks" });
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <h1 className="text-2xl font-bold mb-4">Главная</h1>
      </div>
      <div className="flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-4 w-full pb-6 ">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl">Последние задачи</h2>
            <Button>Создать</Button>
          </div>

          <div className="w-full flex flex-wrap gap-4">
            {tasksData?.tasks?.length === 0 && (
              <AdvantageCarousel items={TASK_ADVANTAGES} />
            )}
            {tasksData?.tasks?.map((el) => (
              <>
                <TaskCardMain.Root
                  project_id={el.project_id || ""}
                  task_id={el.task_id || ""}
                  name={el.name || ""}
                  symbol={el.currency.symbol}
                  rate={Number(el.rate) || 0}
                  payment_type={el.payment_type}
                >
                  <TaskCardMain.Header />
                  <TaskCardMain.Body />
                  <TaskCardMain.Footer />
                </TaskCardMain.Root>
              </>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full pb-6">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl">Последние проекты</h2>
            <Button>Создать</Button>
          </div>
          <div className="w-full">
            {projectsData?.projects?.length === 0 && (
              <AdvantageCarousel items={PROJECT_ADVANTAGES} />
            )}
            {projectsData?.projects?.map((el) => (
              <Card key={el?.project_id} className="min-w-64 w-96 md:w-fit">
                <CardHeader>
                  <CardTitle>{el?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientItem
                    name={el?.client?.name || ""}
                    contact_info={el?.client?.contact_info || ""}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      navigate(
                        `/${ROUTES.PROJECTS}/${TASKS_VIEW.TABLE}/${el?.project_id}`
                      )
                    }
                  >
                    Перейти
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
