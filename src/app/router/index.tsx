import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import NoAccessPage from "@/pages/no-access.page";
import { CONTACTS_VIEW, ROUTES } from "./routes.enum";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import {
  HomePage,
  LoginPage,
  NotesDetailPage,
  NotesPage,
  PlansPage,
  ProjectDetailPage,
  ProjectsPage,
  RegisterPage,
  SettingsPage,
  TaskDetailPage,
  UserPage,
} from "@/pages";
import ContactsPage from "@/pages/contacts/contacts.page";
import ClientsPage from "@/pages/contacts/clients.page";
import FriendsPage from "@/pages/contacts/friends.page";

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
        path: ROUTES.CONTACTS,
        element: <ContactsPage />,
        children: [
          {
            // clients
            path: CONTACTS_VIEW.CLIENTS,
            element: <ClientsPage />,
          },
          {
            // friends
            path: CONTACTS_VIEW.FRIENDS,
            element: <FriendsPage />,
          },
        ],
      },
      {
        path: ROUTES.PROJECTS + "/:id",
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
