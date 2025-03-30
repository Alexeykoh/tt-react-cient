import React, { JSX } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { Routes } from ".";

type Role = "admin" | "user";

interface PrivateRouteProps {
  roles: Role[];
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = Cookies.get("authToken");
  const isDevMode = import.meta.env.MODE === "dev";
  if (!isDevMode) {
    if (!token) {
      return <Navigate to={Routes.AUTH + "/" + Routes.LOGIN} />;
    }
  }
  return children;
};

export default PrivateRoute;
