import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  INotification,
  INotificationResponse,
  notificationsSchema,
  notificationsSchemaResponse,
} from "../interfaces/notifications.interface";

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
      transformResponse: (response: INotificationResponse) => {
        // Валидируем ответ
        const result = notificationsSchemaResponse.safeParse(response);

        if (!result.success) {
          console.error("Невалидный ответ сервера:", result.error);
          throw new Error("Ошибка валидации ответа сервера");
        }

        return result.data;
      },
    }),
    readNotifications: builder.mutation<INotification, string>({
      query: (id) => ({
        url: "notifications/" + id,
        method: "PATCH",
      }),
      transformResponse: (response: { data: INotification }) => {
        // Валидируем ответ
        const result = notificationsSchema.safeParse(response.data);

        if (!result.success) {
          console.error("Невалидный ответ сервера:", result.error);
          throw new Error("Ошибка валидации ответа сервера");
        }

        return result.data;
      },
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useReadNotificationsMutation } =
  notificationsService;
