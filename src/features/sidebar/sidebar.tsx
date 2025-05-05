import { CONTACTS_VIEW, ROUTES } from "@/app/router/routes.enum";
import { NavUser } from "@/components/nav-user";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  Sidebar,
} from "@/components/ui/sidebar";
import { useGetUserQuery } from "@/shared/api/user.service";
import SearchWidget from "@/widgets/search.widget";
import { Home, FileText, Clock, FolderGit2, ContactRound } from "lucide-react";
import { Link } from "react-router";
import SidebarItemFeature from "./sidebar-item";
import { useGetProjectsSharedInvationsQuery } from "@/shared/api/projects-shared.service";
import { Badge } from "@/components/ui/badge";

export default function SidebarFeature() {
  const { data: user } = useGetUserQuery();
  const { data: projectInvitations } = useGetProjectsSharedInvationsQuery(
    undefined,
    { pollingInterval: 10000 }
  );

  return (
    <Sidebar className="h-full">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-lg font-semibold">TimeTracker</span>
          </div>
          <SearchWidget
            searchLocationList={[
              "all",
              "projects",
              "tasks",
              "clients",
              "users",
            ]}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarItemFeature
                tooltip={"Главная"}
                pathname={"/"}
                isIncludePath={false}
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span>Главная</span>
                </Link>
              </SidebarItemFeature>

              <SidebarItemFeature
                tooltip={"Проекты"}
                pathname={`/${ROUTES.PROJECTS}`}
                className="w-full"
              >
                <Link to={`/${ROUTES.PROJECTS}`}>
                  <FolderGit2 className="h-4 w-4" />
                  <div className="w-full flex items-center justify-between gap-2">
                    <span>Проекты</span>
                    {projectInvitations && projectInvitations?.length > 0 && (
                      <Badge
                        variant={"default"}
                        className="flex h-4 w-4 items-center justify-center rounded-full text-xs"
                      >
                        {projectInvitations.length}
                      </Badge>
                    )}
                  </div>
                </Link>
              </SidebarItemFeature>

              <SidebarItemFeature
                tooltip={"Контакты"}
                pathname={`/${ROUTES.CONTACTS}`}
              >
                <Link to={`/${ROUTES.CONTACTS}/${CONTACTS_VIEW.CLIENTS}`}>
                  <ContactRound className="h-4 w-4" />
                  <span>Контакты</span>
                </Link>
              </SidebarItemFeature>

              <SidebarItemFeature
                tooltip={"Заметки"}
                pathname={`/${ROUTES.NOTES}`}
              >
                <Link to={`/${ROUTES.NOTES}`}>
                  <FileText className="h-4 w-4" />
                  <span>Заметки</span>
                </Link>
              </SidebarItemFeature>
            </SidebarMenu>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={user?.name || "user"}
          email={user?.email || "email"}
          avatar="/avatars/shadcn.jpg"
          user_id={user?.user_id || "user_id"}
        />
        <div className="px-2 py-2 text-xs text-muted-foreground">
          © 2025 TimeTracker B415
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
