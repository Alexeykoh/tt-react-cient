import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

interface User {
  id: string;
  name: string;
  role: "admin" | "user";
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password },
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
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
  }),
});

export const { useLoginMutation, useRegisterQuery } = authApi;
