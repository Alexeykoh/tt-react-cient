import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Currency, CurrencySchema } from "../interfaces/currency.interface";
import { z } from "zod";
import { validateWithSchema } from "@/lib/validator";

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
      transformResponse: (response: { data: Currency[] }) => {
        return {
          data: validateWithSchema<Currency[]>(
            z.array(CurrencySchema),
            response.data,
            "getCurrencies"
          )
        };
      },
      providesTags: ["currency-service"],
    }),
  }),
});

export const { useGetCurrenciesQuery } = currencyService;
