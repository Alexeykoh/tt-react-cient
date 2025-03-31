import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Currency } from "../interfaces/currency.interface";

export const currencyService = createApi({
  reducerPath: "currency-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["currency-service"],
  endpoints: (builder) => ({
    getCurrencies: builder.query<{ data: Currency[] }, void>({
      query: () => ({
        url: "currencies",
        method: "GET",
      }),
      providesTags: ["currency-service"],
    }),
  }),
});

export const { useGetCurrenciesQuery } = currencyService;
