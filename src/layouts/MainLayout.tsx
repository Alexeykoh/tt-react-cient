import {
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Clock,
  FolderGit2,
  ChartNoAxesGantt,
  ChevronRight,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import React, { ReactNode } from "react";
import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import PrivateComponent from "@/widgets/private-component";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useGetUserQuery } from "@/shared/api/user.service";
import TaskFloatBarWidget from "@/widgets/task-float-bar.widget";
import SearchWidget from "@/widgets/search.widget";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSearcV2Query } from "@/shared/api/search.service";
import { ROUTES, VIEW_ROUTES } from "@/app/router/routes.enum";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { data: user } = useGetUserQuery();

  useGetCurrenciesQuery();
  useGetSubscriptionsQuery();

  const { data: searchData, isLoading } = useSearcV2Query({
    searchLocation: "projects",
  });

  return (
    <SidebarProvider className="w-screen h-screen flex">
      <Sidebar className="h-full">
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              <span className="text-lg font-semibold">TimeTracker</span>
            </div>
            <SearchWidget />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Collapsible defaultOpen className="group/collapsible">
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
                    isActive={location.pathname.includes(`/${ROUTES.PROJECTS}`)}
                  >
                    <Link to="/projects">
                      <FolderGit2 className="h-4 w-4" />
                      <span>Проекты</span>
                      <CollapsibleTrigger asChild>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    </Link>
                  </SidebarMenuButton>

                  <CollapsibleContent>
                    {isLoading && (
                      <>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SidebarMenuSub>
                            <SidebarMenuItem key={index}>
                              <SidebarMenuSkeleton showIcon />
                            </SidebarMenuItem>
                          </SidebarMenuSub>
                        ))}
                      </>
                    )}
                    {searchData?.projects?.map((el) => (
                      <SidebarMenuSub>
                        <SidebarMenuButton
                          asChild
                          tooltip="Проекты"
                          isActive={location.pathname.includes(
                            `/${el.project_id}`
                          )}
                        >
                          <Link
                            to={`/${ROUTES.PROJECTS}/${VIEW_ROUTES.TABLE}/${el.project_id}`}
                          >
                            <ChartNoAxesGantt className="h-4 w-4" />
                            <span>{el?.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSub>
                    ))}
                  </CollapsibleContent>
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
                    SUBSCRIPTION.FREE,
                    SUBSCRIPTION.BASIC,
                    SUBSCRIPTION.PREMIUM,
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
          </Collapsible>
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
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <header className="flex items-center gap-2 p-2 w-full bg-sidebar">
          <div className="flex items-center gap-2 px-3 w-full">
            <SidebarTrigger />
            <div className="flex justify-end items-end w-full gap-4">
              <TaskFloatBarWidget />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
