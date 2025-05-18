import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLazySearcV2Query } from "@/shared/api/search.service";
import { Search, X } from "lucide-react";
import { formatDate } from "@/lib/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  searchLocationList: Array<"all" | "projects" | "tasks" | "clients" | "users">;
}

export default function SearchInputWidget({ searchLocationList }: Props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState<
    "all" | "projects" | "tasks" | "clients" | "users"
  >(searchLocationList[0]);
  const [triggerSearch, { data, isFetching, error }] = useLazySearcV2Query();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        triggerSearch({ searchLocation, searchTerm });
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchLocation, triggerSearch]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const navigateToItem = (type: string, id: string) => {
    navigate(`/${type}/${id}`);
  };

  const hasResults = data
    ? data.projects.length > 0 ||
      data.tasks.length > 0 ||
      data.clients.length > 0 ||
      data.users.length > 0
    : false;

  return (
    <div className="relative flex items-center w-fullw flex-wrap">
      {/* Строка поиска */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Поиск..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10 pr-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          aria-label="Поиск"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            aria-label="Очистить поиск"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Выпадающий список выбора области поиска, если больше одного варианта */}
      {searchLocationList.length > 1 && (
        <div className="">
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={searchLocation}
            onChange={(e) =>
              setSearchLocation(e.target.value as typeof searchLocation)
            }
            aria-label="Выберите источник поиска"
          >
            {searchLocationList.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "all" && "Все"}
                {loc === "projects" && "Проекты"}
                {loc === "tasks" && "Задачи"}
                {loc === "clients" && "Клиенты"}
                {loc === "users" && "Пользователи"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Результаты поиска */}
      {hasResults && (
        <div
          ref={resultsRef}
          className="absolute top-10 left-0 z-50 w-96 max-h-[60vh] overflow-y-auto rounded-md"
        >
          {isFetching ? (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : error ? (
            <p className="text-destructive text-center py-4 px-4">
              Ошибка при выполнении поиска
            </p>
          ) : searchTerm && !hasResults ? (
            <p className="text-muted-foreground text-center py-8 px-4">
              Ничего не найдено
            </p>
          ) : (
            searchTerm && (
              <div className="p-4 space-y-6">
                {Array.isArray(data?.projects) && data.projects.length > 0 && (
                  <section>
                    <h3 className="text-sm font-medium mb-2">Проекты</h3>
                    <div className="space-y-2">
                      {data.projects.map((project) => (
                        <div
                          key={project.project_id}
                          className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                          onClick={() =>
                            navigateToItem("projects", project.project_id)
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              navigateToItem("projects", project.project_id);
                            }
                          }}
                        >
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {project?.client?.name} •{" "}
                            {formatDate(project.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {Array.isArray(data?.tasks) && data.tasks.length > 0 && (
                  <section>
                    <h3 className="text-sm font-medium mb-2">Задачи</h3>
                    <div className="space-y-2">
                      {data?.tasks?.map((task) => (
                        <div
                          key={task.task_id}
                          className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                          onClick={() => navigateToItem("tasks", task.task_id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              navigateToItem("tasks", task.task_id);
                            }
                          }}
                        >
                          <p className="font-medium">{task.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.project.name} • {task.currency.symbol}
                            {task.rate} • {formatDate(task.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {Array.isArray(data?.clients) && data.clients.length > 0 && (
                  <section>
                    <h3 className="text-sm font-medium mb-2">Клиенты</h3>
                    <div className="space-y-2">
                      {data?.clients?.map((client) => (
                        <div
                          key={client.client_id}
                          className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                          onClick={() =>
                            navigateToItem("clients", client.client_id)
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              navigateToItem("clients", client.client_id);
                            }
                          }}
                        >
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {client.contact_info}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {Array.isArray(data?.users) && data.users.length > 0 && (
                  <Card className="p-2">
                    <CardHeader>
                      <CardTitle>Пользователи</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="space-y-2">
                        {data?.users?.map((user) => (
                          <div
                            key={user.user_id}
                            className="flex gap-2 items-center p-3 rounded-md border hover:bg-accent cursor-pointer"
                            onClick={() =>
                              navigateToItem("users", user.user_id)
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                navigateToItem("users", user.user_id);
                              }
                            }}
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
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
