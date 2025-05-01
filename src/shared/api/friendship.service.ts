import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Friendship, FriendshipMe, FriendshipPending } from "../interfaces/friends.interface";
import { PaginatedResponse } from "../interfaces/api.interface";
import { FriendshipStatus } from "../enums/friendship.enum";

export const friendshipService = createApi({
  reducerPath: "friendship-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "Friend-service",
    "Friend-me-service",
    "Friend-pending-service",
    "Friend-id",
  ],
  endpoints: (builder) => ({
    getFriends: builder.query<
      PaginatedResponse<Friendship>,
      { page: number; status?: FriendshipStatus }
    >({
      query: ({ page, status }) => ({
        url: `friendship/friends?page=${page || 1}${status ? "&status=" + status : ""}`,
        method: "GET",
      }),
      providesTags: ["Friend-service"],
    }),
    getFriendById: builder.query<Friendship, string>({
      query: (user_id) => ({
        url: "friendship/" + user_id,
        method: "GET",
      }),
      providesTags: ["Friend-id"],
      transformResponse: (response: { data: Friendship }) => response.data,
    }),
    getFriendshipMe: builder.query<Array<FriendshipMe>, void>({
      query: () => ({
        url: "friendship/me",
        method: "GET",
      }),
      providesTags: ["Friend-me-service"],
      transformResponse: (response: { data: Array<FriendshipMe> }) =>
        response.data,
    }),
    getFriendshipPending: builder.query<Array<FriendshipPending>, void>({
      query: () => ({
        url: "friendship/request/pending",
        method: "GET",
      }),
      providesTags: ["Friend-pending-service"],
      transformResponse: (response: { data: Array<FriendshipPending> }) =>
        response.data,
    }),
    requestFriendship: builder.mutation<FriendshipPending, string>({
      query: (id) => ({
        url: "friendship/request/" + id,
        method: "POST",
      }),
      invalidatesTags: ["Friend-service", "Friend-id"],
      transformResponse: (response: { data: FriendshipPending }) =>
        response.data,
    }),
    acceptFriendship: builder.mutation<FriendshipPending, string>({
      query: (id) => ({
        url: "friendship/accept/" + id,
        method: "PUT",
      }),
      invalidatesTags: ["Friend-service"],
      transformResponse: (response: { data: FriendshipPending }) =>
        response.data,
    }),
    declineFriendship: builder.mutation<FriendshipPending, string>({
      query: (id) => ({
        url: "friendship/decline/" + id,
        method: "PUT",
      }),
      invalidatesTags: ["Friend-service"],
      transformResponse: (response: { data: FriendshipPending }) =>
        response.data,
    }),
    cancelFriendship: builder.mutation<void, string>({
      query: (id) => ({
        url: "friendship/cancel/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Friend-service"],
    }),
  }),
});

export const {
  useGetFriendshipPendingQuery,
  useGetFriendshipMeQuery,
  useGetFriendsQuery,
  useGetFriendByIdQuery,
  useAcceptFriendshipMutation,
  useCancelFriendshipMutation,
  useDeclineFriendshipMutation,
  useRequestFriendshipMutation,
} = friendshipService;
