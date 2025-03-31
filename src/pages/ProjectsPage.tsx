import { Card, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGetProjectsQuery } from "@/shared/api/projects.service";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import React, { useState } from "react";

const ProjectsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetProjectsQuery({ page: currentPage });

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Проверка на валидность даты
    if (isNaN(date.getTime())) return dateString;

    // Форматирование даты в формат "ДД.ММ.ГГГГ"
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold mb-4">Проекты</h1>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <Table className="flex-1 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Наименование</TableHead>
                <TableHead className="w-[20%]">Клиент</TableHead>
                <TableHead className="w-[20%]">Ставка</TableHead>
                <TableHead className="w-[15%]">Дата</TableHead>
                <TableHead className="w-[15%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="flex-1">
              {data?.data.map((el) => {
                return (
                  <TableRow key={el.project_id}>
                    <TableCell className="font-medium w-[30%]">
                      {el?.name}
                    </TableCell>
                    <TableCell className="w-[20%]">{el?.client_id}</TableCell>
                    <TableCell className="w-[20%]">{`${el?.currency_id} ${el?.rate}`}</TableCell>
                    <TableCell className="text-right w-[15%]">
                      {formatDate(el?.created_at)}
                    </TableCell>
                    <TableCell className="w-[15%] p-0 text-right">
                      <div className="flex justify-end pr-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted ml-auto"
                              size="icon"
                            >
                              <MoreVerticalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <PencilIcon className="mr-2 size-4" />
                              <span>Редактировать</span>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                              <CopyIcon className="mr-2 size-4" />
                              <span>Копировать</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <StarIcon className="mr-2 size-4" />
                              <span>В избранное</span>
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <TrashIcon className="mr-2 size-4" />
                              <span>Удалить</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {data?.meta && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Страница {data.meta.page} из {data.meta.totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage <= 1}
                >
                  Назад
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, data.meta.totalPages)
                    )
                  }
                  disabled={currentPage >= data.meta.totalPages}
                >
                  Вперед
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsPage;
