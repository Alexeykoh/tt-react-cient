import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetTaskByIdQuery } from "@/shared/api/task.service";
import { useGetTimeLogLogsQuery } from "@/shared/api/time-log.service";
import { CalendarDays, ChevronLeft, HandCoins, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { formatDate } from "@/lib/dateUtils";
import { formatMilliseconds } from "@/lib/format-seconds";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: task } = useGetTaskByIdQuery(id || "", { skip: !id });
  const { data: timeLogs } = useGetTimeLogLogsQuery(
    { task_id: id || "" },
    { skip: !id }
  );
  const navigate = useNavigate();

  const chartConfig = {
    desktop: {
      label: "Time Logged",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Преобразуем данные timeLogs в формат для графика
  const chartData =
    timeLogs?.data?.map((log) => ({
      date: formatDate(log.created_at), // или другой формат даты
      desktop: Number(log.duration),
    })) || [];

  // Вычисляем общее время
  const totalTime = chartData.reduce((sum, item) => sum + item.desktop, 0);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-between gap-4">
            <div className="flex items-center gap-4 mb-4">
              <Button
                size={"icon"}
                variant={"default"}
                onClick={() => navigate(-1)}
              >
                <ChevronLeft />
              </Button>
              <div className="flex gap-4 text-2xl font-bold">
                <p>{task?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HandCoins className="w-4 h-4" />
            <p>
              Ставка: {task?.currency?.symbol}
              {task?.rate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <p>Дата создания: {formatDate(task?.created_at || "")}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Время работы</CardTitle>
          <CardDescription>График затраченного времени</CardDescription>
        </CardHeader>
        <CardContent>
          {timeLogs && timeLogs?.data?.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[400px]">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              Нет данных о времени работы
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {timeLogs && timeLogs?.data?.length > 0 && (
            <>
              <div className="flex gap-2 font-medium leading-none">
                Всего времени: {formatMilliseconds(totalTime)} часов{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Показано {timeLogs.data.length} записей о времени работы
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
