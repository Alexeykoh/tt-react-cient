import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  INotification,
  INotificationResponse,
  notificationsSchemaResponse,
} from "../interfaces/notifications.interface";
import { validateWithSchema } from "@/lib/validator";

export const notificationsService = createApi({
  reducerPath: "notifications-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<INotificationResponse, void>({
      query: () => ({
        url: "notifications/me",
        method: "GET",
      }),
      providesTags: ["notifications"],
      transformResponse: (response: { data: INotificationResponse }) => {
        return validateWithSchema<unknown>(
          notificationsSchemaResponse,
          response,
          "getNotifications"
        ) as INotificationResponse
      },
    }),
    readNotifications: builder.mutation<INotification, string>({
      query: (id) => ({
        url: "notifications/read/" + id,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
    readAllNotifications: builder.mutation<INotification, void>({
      query: () => ({
        url: "notifications/read/all",
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useReadNotificationsMutation,
  useReadAllNotificationsMutation,
} = notificationsService;
