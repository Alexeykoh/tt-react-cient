import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Plans } from "../interfaces/plans.interface";

export const plansService = createApi({
  reducerPath: "plans-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["plans-service"],
  endpoints: (builder) => ({
    getPlans: builder.query<Array<Plans>, void>({
      query: () => ({
        url: "plans",
        method: "GET",
      }),
      providesTags: ["plans-service"],
      transformResponse: (response: { data: Array<Plans> }) => response.data,
    }),
  }),
});

export const { useGetPlansQuery } = plansService;
