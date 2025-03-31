import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { User } from "../interfaces/user.unterface";



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
  }),
});

export const { useGetUserQuery } = userService;
