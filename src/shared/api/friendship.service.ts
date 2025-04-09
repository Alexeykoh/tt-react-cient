import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  Friendship,
  Friend,
  FriendshipPending,
} from "../interfaces/friends.interface";

export const friendshipService = createApi({
  reducerPath: "friendship-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Friend-service", "Friend-me-service", "Friend-pending-service"],
  endpoints: (builder) => ({
    getFriends: builder.query<Array<Friend>, void>({
      query: () => ({
        url: "friendship/friends",
        method: "GET",
      }),
      providesTags: ["Friend-service"],
      transformResponse: (response: { data: Array<Friend> }) => response.data,
    }),
    getFriendshipMe: builder.query<Array<Friendship>, void>({
      query: () => ({
        url: "friendship/me",
        method: "GET",
      }),
      providesTags: ["Friend-me-service"],
      transformResponse: (response: { data: Array<Friendship> }) =>
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
      invalidatesTags: ["Friend-service"],
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
    cancelFriendship: builder.mutation<void, void>({
      query: (id) => ({
        url: "friendship/decline/" + id,
        method: "PUT",
      }),
      invalidatesTags: ["Friend-service"],
    }),
  }),
});

export const {
  useGetFriendshipPendingQuery,
  useGetFriendshipMeQuery,
  useGetFriendsQuery,
  useAcceptFriendshipMutation,
  useCancelFriendshipMutation,
  useDeclineFriendshipMutation,
} = friendshipService;
