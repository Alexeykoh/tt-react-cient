import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import PrivateComponent from "@/widgets/private-component";
import { HTMLAttributes } from "react";
import { useLocation } from "react-router-dom";

interface Props extends HTMLAttributes<HTMLDivElement> {
  tooltip: string;
  pathname: string;
  subscription?: SUBSCRIPTION[];
  isIncludePath?: boolean;
  component?: React.ReactNode;
}

export default function SidebarItemFeature({
  children,
  pathname,
  tooltip,
  subscription = [SUBSCRIPTION.FREE, SUBSCRIPTION.BASIC, SUBSCRIPTION.PREMIUM],
  isIncludePath = true,
  component = null,
}: Props) {
  const location = useLocation();
  return (
    <PrivateComponent lockPosition="left" subscriptions={subscription}>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={tooltip}
          isActive={
            !isIncludePath
              ? location.pathname === "/"
              : location.pathname.includes(pathname)
          }
        >
          {children}
        </SidebarMenuButton>
        {component}
      </SidebarMenuItem>
    </PrivateComponent>
  );
}
