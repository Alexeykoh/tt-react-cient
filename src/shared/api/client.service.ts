import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Client } from "../interfaces/client.interface";
import { PaginatedResponse } from "../interfaces/api.interface";

export const clientService = createApi({
  reducerPath: "client-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["client-service"],
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedResponse<Client>, { page: number }>({
      query: ({ page }) => ({
        url: `clients/me?page=${page || 1}`,
        method: "GET",
      }),
      providesTags: ["client-service"],
    }),
  }),
});

export const { useGetClientsQuery } = clientService;
