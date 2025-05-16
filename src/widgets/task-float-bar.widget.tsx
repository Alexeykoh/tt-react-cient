import { useGetTimeLogLatestQuery } from "@/shared/api/time-log.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import { useNavigate } from "react-router-dom";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import { CheckSquare } from "lucide-react";
import TimeLogsTimer from "@/features/time-logs/time-logs-timer";

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
                <Button variant="outline" className="flex gap-2 cursor-pointer">
                  <CheckSquare />
                  <h6 className="text-md/3 font-semibold">
                    {latestTaskLog?.task?.name}
                  </h6>
                </Button>
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
                        `/${ROUTES.PROJECTS}/${TASKS_VIEW.TABLE}/${latestTaskLog?.task?.project?.project_id}`
                      )
                    }
                  >
                    Перейти к задаче
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="pl-2 border-l-2  ">
              <TimeLogsTimer.Root
                task_id={latestTaskLog?.task?.task_id || ""}
                variant="button"
                showTime={true}
                isReverse
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
