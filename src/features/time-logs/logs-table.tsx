"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PaginatedResponse } from "@/shared/interfaces/api.interface";
import { TimeLog } from "@/shared/interfaces/time-log.interface";
import { formatMilliseconds } from "@/lib/format-seconds";

interface props {
  logs: PaginatedResponse<TimeLog>;
}

const chartConfig = {
  duration: {
    label: "duration",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function LogsTable({ logs }: props) {
  const logsData = logs?.data;
  return (
    <Card className="max-w-96">
      <CardHeader>
        <CardTitle>Отметки времени</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={logsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="updated_at"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toISOString().split("T")[0];
              }}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
              labelFormatter={(value: string) => {
                const date = new Date(value);
                return date.toISOString().split("T")[0];
              }}
              formatter={(value: number) => {
                const duration = formatMilliseconds(value);
                return `${duration.hours}:${duration.minutes}:${duration.seconds}`;
              }}
            />
            <Bar dataKey="duration" fill="var(--chart-1)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
