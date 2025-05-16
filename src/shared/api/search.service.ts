import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Search, SearchSchema } from "../interfaces/search.interface";
import {validateWithSchema} from "@/lib/validator";


type SearchLocation = "all" | "projects" | "tasks" | "clients" | "users";

export const searchService = createApi({
  reducerPath: "search-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["search-v2"],
  endpoints: (builder) => ({
    searcV2: builder.query<
      Search,
      { searchLocation: SearchLocation; searchTerm?: string }
    >({
      query: ({ searchLocation = "all", searchTerm }) => {
        const params = new URLSearchParams();
        if (searchLocation) params.append("searchLocation", searchLocation);
        if (searchTerm) params.append("searchTerm", searchTerm);

        // Получаем базовый URL и заменяем /v1/ на /v2/
        const baseUrl = import.meta.env.VITE_API_URL.replace("/v1", "/v2");

        return {
          url: `${baseUrl}/search?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: Search }) => {
        return validateWithSchema<Search>(
          SearchSchema,
          response.data,
          "searcV2"
        );
      },
      providesTags: ["search-v2"],
    }),
  }),
});

export const { useLazySearcV2Query, useSearcV2Query } = searchService;
