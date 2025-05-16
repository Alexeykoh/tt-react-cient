import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  EditUserNameDTO,
  EditUserNameSchema,
  User,
  UserSchema,
} from "../interfaces/user.interface";
import {validateWithSchema} from "@/lib/validator";

export const userService = createApi({
  reducerPath: "user-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["user-service", "user-id-service"],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      transformResponse: (response: { data: User }) => {
        return validateWithSchema<User>(UserSchema, response.data);
      },
      providesTags: ["user-service"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: "users/" + id,
        method: "GET",
      }),
      transformResponse: (response: { data: User }) => {
        return validateWithSchema<User>(UserSchema, response.data);
      },
      providesTags: ["user-id-service"],
    }),
    editUserName: builder.mutation<User, EditUserNameDTO>({
      query: (user) => ({
        url: "users/me",
        method: "PATCH",
        body: user,
      }),
      transformResponse: (response: { data: User }) => {
        return validateWithSchema<User>(UserSchema, response.data);
      },
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

export const { useGetUserQuery, useEditUserNameMutation, useGetUserByIdQuery } =
  userService;
