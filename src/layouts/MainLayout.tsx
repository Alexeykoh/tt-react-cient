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
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, FileText, Clock } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import React, { ReactNode } from "react";
import { Separator } from "@radix-ui/react-separator";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="w-screen h-screen p-2 lg:p-0  bg-auto bg-center bg-no-repea bg-[url(https://images.unsplash.com/photo-1679416092238-a69cf0a0023a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
      <SidebarProvider >
        <Sidebar >
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
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser />
            <div className="px-2 py-2 text-xs text-muted-foreground">
              © 2025 TimeTracker B415
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="w-full">
          <header className="backdrop-blur-sm flex h-16 shrink-0 items-center gap-2 border-b w-full">
            <div className="flex items-center gap-2 px-3 w-full">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
          </header>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
