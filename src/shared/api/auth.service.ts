import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  AuthResponse,
  AuthResponseSchema,
  User,
  UserSchema,
} from "../interfaces/user.interface";
import {
  RegisterRequest,
  RegisterResponse,
  registerResponseSchema,
} from "../interfaces/register.interface";
import {validateWithSchema} from "@/lib/validator";

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
      transformResponse: (response: { data: AuthResponse }) => {
        return validateWithSchema<AuthResponse>(
          AuthResponseSchema,
          response.data
        );
      },
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: ({ name, password, email }) => ({
        url: "users/register",
        method: "POST",
        body: { name, password, email },
      }),
      transformResponse: (response: { data: RegisterResponse }) => {
        return validateWithSchema<RegisterResponse>(
          registerResponseSchema,
          response.data
        );
      },
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      transformResponse: (response: { data: User }) => {
          return validateWithSchema<User>(
          UserSchema,
          response.data
        );
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } =
  authApi;
