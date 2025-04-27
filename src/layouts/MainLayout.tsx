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
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, FileText, Clock } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import React, { ReactNode } from "react";
import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import PrivateComponent from "@/widgets/private-component";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useGetUserQuery } from "@/shared/api/user.service";
import TaskFloatBarWidget from "@/widgets/task-float-bar.widget";
import SearchWidget from "@/widgets/search.widget";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { data: user } = useGetUserQuery();

  useGetCurrenciesQuery();
  useGetSubscriptionsQuery();

  return (
    <div className="w-screen h-screen bg-auto bg-center bg-no-repea bg-[url(https://images.unsplash.com/photo-1682334288172-88e43f2d7d59?q=80&w=3389&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
      <SidebarProvider>
        <Sidebar>
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
        <main className="w-full h-full overflow-hidden">
          <header className="flex shrink-0 items-center gap-2 p-2 w-full bg-sidebar/50 backdrop-blur-md">
            <div className="flex items-center gap-2 px-3 w-full">
              <SidebarTrigger />
              <div className="flex justify-end items-end w-full gap-4">
                <TaskFloatBarWidget />
              </div>
            </div>
          </header>
          <div className="container mx-auto flex h-full w-full overflow-auto">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
