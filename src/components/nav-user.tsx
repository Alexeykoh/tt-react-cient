import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import Cookies from "js-cookie";
import { ROUTES } from "@/app/router/routes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUserQuery } from "@/shared/api/user.service";
import { Link } from "react-router-dom";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import UserAvatar from "./user-avatar";

interface NavUserProps {
  name: string;
  email: string;
  avatar: string;
}

export function NavUser({ name, email, avatar }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { isLoading, error } = useGetUserQuery();
  const { data: subscriptionData } = useGetSubscriptionsQuery();
  const user = { name, email, avatar, user_id: email };

  // Если данные загружаются или произошла ошибка, показываем заглушку
  if (isLoading || error || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">...</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Загрузка...</span>
              <span className="truncate text-xs">Пожалуйста, подождите</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar
                name={user.name}
                planId={subscriptionData?.planId as SUBSCRIPTION}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  name={user.name}
                  planId={subscriptionData?.planId as SUBSCRIPTION}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to={ROUTES.PLANS}>
                <DropdownMenuItem>
                  <Sparkles />
                  Обновить до Pro
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to={ROUTES.USER}>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Аккаунт
                </DropdownMenuItem>
              </Link>
              <Link to={ROUTES.SETTINGS}>
                <DropdownMenuItem>
                  <Settings />
                  Настройки
                </DropdownMenuItem>
              </Link>
              <Link to={ROUTES.NOTIFICATIONS}>
                <DropdownMenuItem>
                  <Bell />
                  Уведомления
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                Cookies.remove("authToken");
                window.location.href = ROUTES.AUTH + "/" + ROUTES.LOGIN;
              }}
            >
              <LogOut />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
