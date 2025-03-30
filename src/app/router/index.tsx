import React from "react";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ClientsPage from "@/pages/ClientsPage";
import NotesPage from "@/pages/NotesPage";

export enum Routes {
  HOME = "/",
  AUTH = "/auth",
  LOGIN = "sign-in",
  REGISTER = "sign-up",
  PROJECTS = "projects",
  CLIENTS = "clients",
  NOTES = "notes",
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
        path: Routes.PROJECTS,
        element: (
          <PrivateRoute roles={["admin", "user"]}>
            <ProjectsPage />
          </PrivateRoute>
        ),
      },
      {
        path: Routes.CLIENTS,
        element: (
          <PrivateRoute roles={["admin", "user"]}>
            <ClientsPage />
          </PrivateRoute>
        ),
      },
      {
        path: Routes.NOTES,
        element: (
          <PrivateRoute roles={["admin", "user"]}>
            <NotesPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
