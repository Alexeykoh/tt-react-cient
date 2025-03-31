import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { PaginatedResponse } from "../interfaces/api.interface";

export interface Project {
  project_id: string;
  name: string;
  client_id: string | null;
  user_owner_id: string;
  currency_id: number;
  rate: number;
  created_at: string;
  updated_at: string;
}

export const projectsService = createApi({
  reducerPath: "project-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["project-service"],
  endpoints: (builder) => ({
    getProjects: builder.query<PaginatedResponse<Project>, { page: number }>({
      query: ({page}) => ({
        url: `projects/me?page=${page || 1}`,
        method: "GET",
      }),
      providesTags: ["project-service"],
    }),
  }),
});

export const { useGetProjectsQuery } = projectsService;
