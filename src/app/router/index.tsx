import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/login.page";
import HomePage from "@/pages/home.page";
import RegisterPage from "@/pages/register.page";
import ProjectsPage from "@/pages/projects.page";
import ClientsPage from "@/pages/clients.page";
import NotesPage from "@/pages/notes.page";
import ProjectDetailPage from "@/pages/project-detail.page";
import NoAccessPage from "@/pages/no-access.page";
import { ROUTES } from "./routes";
import TaskDetailPage from "@/pages/task-detail.page";
import { SUNSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import NotesDetailPage from "@/pages/notes-detail.page";

const router = createBrowserRouter([
  {
    path: ROUTES.AUTH,
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.NO_ACCESS,
        element: <NoAccessPage />,
      },
    ],
  },
  {
    path: ROUTES.HOME,
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      {
        path: "",
        element: (
          <PrivateRoute
            roles={[
              SUNSCRIPTION.BASIC,
              SUNSCRIPTION.FREE,
              SUNSCRIPTION.PREMIUM,
            ]}
          >
            <HomePage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.PROJECTS,
        element: (
          <PrivateRoute
            roles={[
              SUNSCRIPTION.BASIC,
              SUNSCRIPTION.FREE,
              SUNSCRIPTION.PREMIUM,
            ]}
          >
            <ProjectsPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.PROJECTS + "/:id",
        element: (
          <PrivateRoute
            roles={[
              SUNSCRIPTION.BASIC,
              SUNSCRIPTION.FREE,
              SUNSCRIPTION.PREMIUM,
            ]}
          >
            <ProjectDetailPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.TASKS + "/:id",
        element: (
          <PrivateRoute
            roles={[
              SUNSCRIPTION.BASIC,
              // SUNSCRIPTION.FREE,
              SUNSCRIPTION.PREMIUM,
            ]}
          >
            <TaskDetailPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.NOTES + "/:id",
        element: (
          <PrivateRoute
            roles={[
              SUNSCRIPTION.BASIC,
              SUNSCRIPTION.FREE,
              SUNSCRIPTION.PREMIUM,
            ]}
          >
            <NotesDetailPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.CLIENTS,
        element: (
          <PrivateRoute
            roles={[
              SUNSCRIPTION.BASIC,
              SUNSCRIPTION.FREE,
              SUNSCRIPTION.PREMIUM,
            ]}
          >
            <ClientsPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.NOTES,
        element: (
          <PrivateRoute
            roles={[
              SUNSCRIPTION.BASIC,
              SUNSCRIPTION.FREE,
              SUNSCRIPTION.PREMIUM,
            ]}
          >
            <NotesPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
