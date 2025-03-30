import React from "react";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import AboutPage from "@/pages/AboutPage";
import ContactsPage from "@/pages/ContactsPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";

export enum Routes {
  HOME = "/",
  AUTH = "/auth",
  LOGIN = "sign-in",
  REGISTER = "sign-up",
  CONTACTS = "contacts",
  ABOUT = "about",
}

const router = createBrowserRouter([
  {
    path: Routes.AUTH,
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: Routes.LOGIN,
        element: <LoginPage />,
      },
      {
        path: Routes.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: Routes.HOME,
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      {
        path: "",
        element: (
          <PrivateRoute roles={["admin", "user"]}>
            <HomePage />
          </PrivateRoute>
        ),
      },
      {
        path: Routes.CONTACTS,
        element: (
          <PrivateRoute roles={["admin", "user"]}>
            <ContactsPage />
          </PrivateRoute>
        ),
      },
      {
        path: Routes.ABOUT,
        element: (
          <PrivateRoute roles={["admin", "user"]}>
            <AboutPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
