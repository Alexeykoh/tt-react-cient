import {
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Briefcase, FileText, Clock } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import React, { ReactNode } from "react";
import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import { useGetTimeLogLatestQuery } from "@/shared/api/time-log.service";
import { Card, CardContent } from "@/components/ui/card";
import TaskItem from "@/components/task-item";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import PrivateComponent from "@/widgets/private-component";
import { SUNSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useGetUserQuery } from "@/shared/api/user.service";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useGetCurrenciesQuery();
  const { data: user } = useGetUserQuery();
  const { data: latestTaskLog } = useGetTimeLogLatestQuery();

  return (
    <div className="w-screen h-screen p-2 lg:p-0  bg-auto bg-center bg-no-repea bg-[url(https://images.unsplash.com/photo-1732732291583-af1deca63038?q=80&w=2063&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <Clock className="h-6 w-6" />
              <span className="text-lg font-semibold">TimeTracker</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Главная"
                    isActive={location.pathname === "/"}
                  >
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      <span>Главная</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Проекты"
                    isActive={location.pathname === "/projects"}
                  >
                    <Link to="/projects">
                      <Briefcase className="h-4 w-4" />
                      <span>Проекты</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Клиенты"
                    isActive={location.pathname === "/clients"}
                  >
                    <Link to="/clients">
                      <Users className="h-4 w-4" />
                      <span>Клиенты</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <PrivateComponent
                  lockPosition="left"
                  subscriptions={[
                    SUNSCRIPTION.FREE,
                    SUNSCRIPTION.BASIC,
                    SUNSCRIPTION.PREMIUM,
                  ]}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Заметки"
                      isActive={location.pathname === "/notes"}
                    >
                      <Link to="/notes">
                        <FileText className="h-4 w-4" />
                        <span>Заметки</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PrivateComponent>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser
              name={user?.name || "user"}
              email={user?.email || "email"}
              avatar="/avatars/shadcn.jpg"
            />
            <div className="px-2 py-2 text-xs text-muted-foreground">
              © 2025 TimeTracker B415
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="w-full">
          <header className="flex shrink-0 items-center  gap-2 p-2 w-full">
            <div className="flex items-center gap-2 px-3 w-full">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex justify-center w-full">
                {latestTaskLog && (
                  <>
                    <div className="flex items-center gap-2">
                      <TaskItem
                        showTime={false}
                        task_id={latestTaskLog?.task?.task_id || ""}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Card className="flex flex-row items-start p-1 cursor-pointer">
                            <CardContent>
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
                            <p className="text-xs font-light opacity-75">
                              {"Проект:"}
                            </p>
                            <h6 className="text-md font-semibold">
                              {latestTaskLog?.task?.project?.name}
                            </h6>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs font-light opacity-75">
                              {"Задача:"}
                            </p>
                            <h6 className="text-md font-semibold">
                              {latestTaskLog?.task?.name}
                            </h6>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs font-light opacity-75">
                              {"Ставка:"}
                            </p>
                            <h6 className="text-md font-semibold">
                              {`${latestTaskLog?.task?.currency?.symbol}${latestTaskLog?.task?.rate} / ${
                                latestTaskLog?.task?.payment_type ===
                                PAYMENT.HOURLY
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
              </div>
            </div>
          </header>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
