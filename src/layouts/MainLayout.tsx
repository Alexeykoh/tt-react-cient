import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { useGetCurrenciesQuery } from "@/shared/api/currency.service";
import TaskFloatBarWidget from "@/widgets/task-float-bar.widget";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import SidebarFeature from "@/features/sidebar/sidebar";
import { useGetNotificationsQuery } from "@/shared/api/notification.service";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@/features/notification/notification.slice";
import NotificationsFeature from "@/features/notification/notifications.feature";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isLoading: currenciesLoading } = useGetCurrenciesQuery();
  const { isLoading: subscriptionLoading } = useGetSubscriptionsQuery();
  const dispatch = useDispatch();
  const notificationIsOpen = useSelector(
    (state: RootState) => state.notification.isOpen
  );

  useGetNotificationsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  function sheetHandler(state: boolean) {
    dispatch(toggle(state));
  }

  return (
    <>
      <Sheet
        open={notificationIsOpen}
        onOpenChange={(data) => sheetHandler(data)}
      >
        <SheetContent className="w-[400px] sm:w-[540px] p-4">
          <SheetHeader>
            <SheetTitle>Уведомления</SheetTitle>
            <NotificationsFeature/>
          </SheetHeader>
        </SheetContent>
      </Sheet>
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
