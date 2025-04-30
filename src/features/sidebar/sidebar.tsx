import { ROUTES } from "@/app/router/routes.enum";
import { NavUser } from "@/components/nav-user";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  Sidebar,
} from "@/components/ui/sidebar";
import { useSearcV2Query } from "@/shared/api/search.service";
import { useGetUserQuery } from "@/shared/api/user.service";
import SearchWidget from "@/widgets/search.widget";
import {
  Home,
  FileText,
  Clock,
  FolderGit2,
  ChevronRight,
  ContactRound,
} from "lucide-react";
import { Link } from "react-router";
import SidebarItemFeature from "./sidebar-item";
import SidebarIetmsList from "./sidebar-ittems-list";

export default function SidebarFeature() {
  const { data: user } = useGetUserQuery();
  const { data: searchData } = useSearcV2Query({
    searchLocation: "projects",
  });

  console.log("SidebarFeature/reload");

  return (
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
                component={
                  <SidebarIetmsList projects={searchData?.projects || []} />
                }
              >
                <div>
                  <FolderGit2 className="h-4 w-4" />
                  <span>Проекты</span>
                  <CollapsibleTrigger asChild>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </div>
              </SidebarItemFeature>

              <SidebarItemFeature
                tooltip={"Контакты"}
                pathname={`/${ROUTES.CONTACTS}`}
              >
                <Link to={`/${ROUTES.CONTACTS}`}>
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
        />
        <div className="px-2 py-2 text-xs text-muted-foreground">
          © 2025 TimeTracker B415
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
