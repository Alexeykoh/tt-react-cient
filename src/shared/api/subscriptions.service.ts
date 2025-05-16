import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  Subscriptions,
  SubscriptionsSchema,
} from "../interfaces/subscriptions.interface";
import { SUBSCRIPTION } from "../enums/sunscriptions.enum";
import {validateWithSchema} from "@/lib/validator";

export const subscriptionsService = createApi({
  reducerPath: "subscriptions-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["subscriptions-service"],
  endpoints: (builder) => ({
    getSubscriptions: builder.query<Subscriptions, void>({
      query: () => ({
        url: "/subscriptions/me",
        method: "GET",
      }),
      providesTags: ["subscriptions-service"],
      transformResponse: (response: { data: Subscriptions }) => {
        return validateWithSchema<Subscriptions>(
          SubscriptionsSchema,
          response.data,
          "getSubscriptions"
        );
      },
    }),
    createSubscriptions: builder.mutation<SUBSCRIPTION, SUBSCRIPTION>({
      query: (plan) => ({
        url: `/subscriptions/subscribe?${plan}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateSubscriptionsMutation, useGetSubscriptionsQuery } =
  subscriptionsService;
