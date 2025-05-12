import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Plans, PlansSchema } from "../interfaces/plans.interface";
import { validateWithSchema } from "@/lib/validator";
import { z } from "zod";

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
      transformResponse: (response: { data: Array<Plans> }) => {
        return validateWithSchema<Array<Plans>>(
          z.array(PlansSchema),
          response.data,
          "getPlans"
        );
      },
    }),
  }),
});

export const { useGetPlansQuery } = plansService;
