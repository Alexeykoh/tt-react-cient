import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import NoAccessPage from "@/pages/no-access.page";
import { ROUTES, VIEW_ROUTES } from "./routes.enum";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import {
  ClientsPage,
  HomePage,
  LoginPage,
  NotesDetailPage,
  NotesPage,
  NotificationsPage,
  PlansPage,
  ProjectDetailPage,
  ProjectsPage,
  RegisterPage,
  SettingsPage,
  TaskDetailPage,
  UserPage,
} from "@/pages";
import { TasksListTablePage } from "@/pages/tasks/tasks-list-table.page";

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
    path: ROUTES.PLANS,
    element: (
      <PrivateRoute
        roles={[SUBSCRIPTION.BASIC, SUBSCRIPTION.FREE, SUBSCRIPTION.PREMIUM]}
      >
        <PlansPage />
      </PrivateRoute>
    ),
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
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
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
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
            ]}
          >
            <ProjectsPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.PROJECTS,
        element: (
          <PrivateRoute
            roles={[
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
            ]}
          >
            <ProjectDetailPage />
          </PrivateRoute>
        ),
        children: [
          {
            // table
            path: VIEW_ROUTES.TABLE + "/:id",
            element: <TasksListTablePage />,
          },
          {
            // list
            path: VIEW_ROUTES.LIST + "/:id",
            element: <ProjectDetailPage />,
          },
          {
            // board
            path: VIEW_ROUTES.BOARD + "/:id",
            element: <ProjectDetailPage />,
          },
        ],
      },
      {
        path: ROUTES.TASKS + "/:id",
        element: (
          <PrivateRoute
            roles={[
              SUBSCRIPTION.BASIC,
              // SUNSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
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
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
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
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
            ]}
          >
            <ClientsPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.USER + "/:id",
        element: (
          <PrivateRoute
            roles={[
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
            ]}
          >
            <UserPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <PrivateRoute
            roles={[
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
            ]}
          >
            <SettingsPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: (
          <PrivateRoute
            roles={[
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
            ]}
          >
            <NotificationsPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.NOTES,
        element: (
          <PrivateRoute
            roles={[
              SUBSCRIPTION.BASIC,
              SUBSCRIPTION.FREE,
              SUBSCRIPTION.PREMIUM,
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
