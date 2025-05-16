import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar";
import { Project } from "@/shared/interfaces/project.interface";
import { ChartNoAxesGantt } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  projects: Project[];
}

export default function SidebarIetmsList({ projects }: Props) {
  return (
    <CollapsibleContent>
      {projects?.map((el) => (
        <SidebarMenuSub key={el.project_id}>
          <SidebarMenuButton
            asChild
            tooltip="Проекты"
            isActive={location.pathname.includes(`/${el.project_id}`)}
          >
            <Link
              to={`/${ROUTES.PROJECTS}/${TASKS_VIEW.TABLE}/${el.project_id}`}
            >
              <ChartNoAxesGantt className="h-4 w-4" />
              <span>{el?.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuSub>
      ))}
    </CollapsibleContent>
  );
}
