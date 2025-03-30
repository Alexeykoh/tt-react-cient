import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

export interface User {
  user_id: string;
  name: string;
  email: string;
  password: "string";
  subscriptionType: "free";
  created_at: "2025-03-30T19:26:05.080Z";
  updated_at: "2025-03-30T19:26:05.080Z";
}

export const UserService = createApi({
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

export const {useGetUserQuery} = UserService;
