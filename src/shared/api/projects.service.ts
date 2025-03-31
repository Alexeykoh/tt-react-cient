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

export interface CreateProjectRequest {
  name: string;
  currency_id: string;
  rate: number;
  tag_ids: string[];
  client_id: string | null;
}

export interface UpdateProjectRequest {
  name: string;
  currency_id: string;
  rate: number;
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
    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (data) => ({
        url: "projects/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["project-service"],
    }),
    updateProject: builder.mutation<Project, { id: string; data: UpdateProjectRequest }>({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["project-service"],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["project-service"],
    }),
  }),
});

export const { 
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation
} = projectsService;
