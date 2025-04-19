import React, { JSX } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { ROUTES } from "./routes.enum";
import { useGetUserQuery } from "@/shared/api/user.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";

interface PrivateRouteProps {
  roles: Array<SUBSCRIPTION>;
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { data: userData } = useGetUserQuery();
  const { data: subscriptionData } = useGetSubscriptionsQuery();
  const { enqueueSnackbar } = useSnackbar();
  const token = Cookies.get("authToken");
  const isDevMode = import.meta.env.MODE === "dev";

  if (!isDevMode) {
    if (!token) {
      return <Navigate to={ROUTES.AUTH + "/" + ROUTES.LOGIN} />;
    }
    if (
      userData &&
      subscriptionData &&
      !roles.includes(subscriptionData?.planId as SUBSCRIPTION)
    ) {
      enqueueSnackbar("У вас нет доступа к этой странице (Подписка)", {
        variant: "error",
      });
      return <Navigate to={ROUTES.AUTH + "/" + ROUTES.NO_ACCESS} />;
    }
  }

  return children;
};

export default PrivateRoute;
