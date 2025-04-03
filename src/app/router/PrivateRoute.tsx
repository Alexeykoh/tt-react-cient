import React, { JSX } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { ROUTES } from "./routes";
import { SUNSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useGetUserQuery } from "@/shared/api/user.service";

interface PrivateRouteProps {
  roles: Array<SUNSCRIPTION>;
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { data: userData } = useGetUserQuery();
  const { enqueueSnackbar } = useSnackbar();
  const token = Cookies.get("authToken");
  const userSubscription = userData?.subscriptionType as SUNSCRIPTION;
  const isDevMode = import.meta.env.MODE === "dev";

  if (!isDevMode) {
    if (!token) {
      return <Navigate to={ROUTES.AUTH + "/" + ROUTES.LOGIN} />;
    }
    if (userData && !roles.includes(userSubscription)) {
      enqueueSnackbar("У вас нет доступа к этой странице.", {
        variant: "error",
      });
      return <Navigate to={ROUTES.AUTH + "/" + ROUTES.NO_ACCESS} />;
    }
  }

  return children;
};

export default PrivateRoute;
