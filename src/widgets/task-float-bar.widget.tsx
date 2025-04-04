import { useGetTimeLogLatestQuery } from "@/shared/api/time-log.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TaskItem from "@/components/task-item";
import { Button } from "@/components/ui/button";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import { useNavigate } from "react-router-dom";

export default function TaskFloatBarWidget() {
  const navigate = useNavigate();
  const { data: latestTaskLog } = useGetTimeLogLatestQuery();

  return (
    <>
      {latestTaskLog && (
        <>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Card className="flex flex-row items-start p-0 cursor-pointer">
                  <CardContent className="flex gap-2 px-3 py-2">
                    <TaskItem
                      showTime={false}
                      task_id={latestTaskLog?.task?.task_id || ""}
                    />
                    <div className="flex flex-col min-w-16 ">
                      <p className="text-sm/3 font-light opacity-75">
                        {"Задача:"}
                      </p>
                      <h6 className="text-md/3 font-semibold">
                        {latestTaskLog?.task?.name}
                      </h6>
                    </div>
                  </CardContent>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-80 space-y-2">
                <div className="flex flex-col">
                  <p className="text-xs font-light opacity-75">{"Проект:"}</p>
                  <h6 className="text-md font-semibold">
                    {latestTaskLog?.task?.project?.name}
                  </h6>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-light opacity-75">{"Задача:"}</p>
                  <h6 className="text-md font-semibold">
                    {latestTaskLog?.task?.name}
                  </h6>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-light opacity-75">{"Ставка:"}</p>
                  <h6 className="text-md font-semibold">
                    {`${latestTaskLog?.task?.currency?.symbol}${latestTaskLog?.task?.rate} / ${
                      latestTaskLog?.task?.payment_type === PAYMENT.HOURLY
                        ? "почасовая"
                        : "фиксированная"
                    }`}
                  </h6>
                </div>
                <div className="flex flex-col mt-4">
                  <Button
                    onClick={() =>
                      navigate(
                        `/projects/${latestTaskLog?.task?.project?.project_id}`
                      )
                    }
                  >
                    Перейти к задаче
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </>
  );
}
