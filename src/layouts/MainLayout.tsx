import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import TaskFloatBarWidget from "@/widgets/task-float-bar.widget";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import SidebarFeature from "@/features/sidebar/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isLoading: currenciesLoading } = useGetCurrenciesQuery();
  const { isLoading: subscriptionLoading } = useGetSubscriptionsQuery();

  return (
    <>
      <SidebarProvider className="w-screen h-screen flex">
        {!currenciesLoading && !subscriptionLoading && <SidebarFeature />}
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
    </>
  );
};

export default MainLayout;
