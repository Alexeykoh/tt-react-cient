import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazySearcV2Query } from "@/shared/api/search.service";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";

interface props {
  searchLocationList: Array<"all" | "projects" | "tasks" | "clients" | "users">;
}

export default function SearchWidget({ searchLocationList }: props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState<
    "all" | "projects" | "tasks" | "clients" | "users"
  >(searchLocationList[0]);
  const [triggerSearch, { data, isFetching, error }] = useLazySearcV2Query();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      triggerSearch({ searchLocation, searchTerm });
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchLocation]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const navigateToItem = (type: string, id: string) => {
    navigate(`/${type}/${id}`);
  };

  const hasResults =
    data &&
    (data.projects.length > 0 ||
      data.tasks.length > 0 ||
      data.clients.length > 0 ||
      data.users.length > 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Search className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn(
          "mx-auto max-w-md rounded-b-lg",
          "bg-background/90 backdrop-blur-lg"
          // "fixed inset-x-0 top-0 h-[80vh]"
        )}
      >
        <div className="mx-auto w-full max-w-sm">
          <SheetHeader className="text-center">
            <SheetTitle>Поиск</SheetTitle>
            <SheetDescription>
              Введите запрос для поиска по системе
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 pb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10 pr-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex space-x-2 mt-3 mb-4">
              {(searchLocationList || []).map((loc) => (
                <button
                  key={loc}
                  className={`text-xs px-2 py-1 rounded-md ${
                    searchLocation === loc
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setSearchLocation(loc)}
                >
                  {loc === "all" && "Все"}
                  {loc === "projects" && "Проекты"}
                  {loc === "tasks" && "Задачи"}
                  {loc === "clients" && "Клиенты"}
                  {loc === "users" && "Пользователи"}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              {isFetching ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              ) : error ? (
                <p className="text-destructive text-center py-4">
                  Ошибка при выполнении поиска
                </p>
              ) : searchTerm && !hasResults ? (
                <p className="text-muted-foreground text-center py-8">
                  Ничего не найдено
                </p>
              ) : (
                <>
                  {data && data?.projects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Проекты</h3>
                      <div className="space-y-2">
                        {data.projects.map((project) => {
                          const owner = project.members.find(
                            (el) => el.role === PROJECT_ROLE.OWNER
                          );
                          return (
                            <div
                              key={project.project_id}
                              className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                              onClick={() =>
                                navigateToItem("projects", project.project_id)
                              }
                            >
                              <p className="font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {project?.client?.name}
                              </p>

                              <p className="text-xs text-muted-foreground">{owner?.user.name}</p>
                              <p className="text-xs text-muted-foreground">{owner?.user.email}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {data && data?.tasks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Задачи</h3>
                      <div className="space-y-2">
                        {data.tasks.map((task) => (
                          <div
                            key={task.task_id}
                            className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                            onClick={() =>
                              navigateToItem("tasks", task.task_id)
                            }
                          >
                            <p className="font-medium">{task.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.project.name} • {task.currency.symbol}
                              {task.rate} • {formatDate(task.created_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data && data?.clients.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Клиенты</h3>
                      <div className="space-y-2">
                        {data.clients.map((client) => (
                          <div
                            key={client.client_id}
                            className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                            onClick={() =>
                              navigateToItem("clients", client.client_id)
                            }
                          >
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {client.contact_info}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data && data?.users.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Пользователи</h3>
                      <div className="space-y-2">
                        {data.users?.map((user) => (
                          <div
                            key={user.user_id}
                            className="flex gap-2 items-center p-3 rounded-md border hover:bg-accent cursor-pointer"
                            onClick={() =>
                              navigateToItem("users", user.user_id)
                            }
                          >
                            <UserAvatar
                              name={user.name}
                              planId={SUBSCRIPTION.FREE}
                              size="small"
                            />
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <SheetFooter className="pt-2">
            <SheetClose asChild>
              <Button variant="outline">Закрыть</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
