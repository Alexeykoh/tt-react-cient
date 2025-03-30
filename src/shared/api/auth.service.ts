import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
  email?: string;
  avatar?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password },
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
      invalidatesTags: ["User"],
    }),
    register: builder.query<
      AuthResponse,
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: "auth/register",
        method: "POST",
        body: { username, password },
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      transformResponse: (response: { data: User }) => response.data,
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterQuery, useGetCurrentUserQuery } = authApi;
