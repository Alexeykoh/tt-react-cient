import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { formatDate } from "@/lib/dateUtils";
import { useGetTaskByIdQuery } from "@/shared/api/task.service";
import { useGetTimeLogLogsQuery } from "@/shared/api/time-log.service";
import { CalendarDays, ChevronLeft, HandCoins } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: task } = useGetTaskByIdQuery(id || "", { skip: !id });
  const { data: timeLogs } = useGetTimeLogLogsQuery(
    {
      task_id: id || "",
    },
    { skip: !id }
  );
  const navigate = useNavigate();

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <>
      <div className="container mx-auto p-4 flex flex-col gap-4">
        <Card>
          <CardContent>
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
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            {timeLogs && timeLogs?.data?.length > 0 && (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={timeLogs.data.map((el) => ({
                    month: el.log_id,
                    desktop: Number(el.duration),
                  }))}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
