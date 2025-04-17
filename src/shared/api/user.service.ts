import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  EditUserNameDTO,
  EditUserNameSchema,
  User,
} from "../interfaces/user.interface";

export const userService = createApi({
  reducerPath: "user-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["user-service"],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      transformResponse: (response: { data: User }) => response.data,
      providesTags: ["user-service"],
    }),
    editUserName: builder.mutation<User, EditUserNameDTO>({
      query: (user) => ({
        url: "users/me",
        method: "PATCH",
        body: user,
      }),
      transformResponse: (response: { data: User }) => response.data,
      invalidatesTags: ["user-service"],
      async onQueryStarted(arg) {
        const validationResult = EditUserNameSchema.safeParse(arg);
        if (!validationResult.success) {
          const errors = validationResult.error.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errors);
        }
      },
    }),
  }),
});

export const { useGetUserQuery, useEditUserNameMutation } = userService;
