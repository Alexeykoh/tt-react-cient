import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { PaginatedResponse } from "../interfaces/api.interface";
import {
  CreateProjectDTO,
  Project,
  UpdateProjectDTO,
} from "../interfaces/project.interface";

export const projectsService = createApi({
  reducerPath: "project-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["project-service"],
  endpoints: (builder) => ({
    getProjectById: builder.query<Project, { id: string }>({
      query: ({ id }) => ({
        url: `projects/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Project }) => response.data,
      providesTags: ["project-service"],
    }),
    getProjects: builder.query<PaginatedResponse<Project>, { page: number }>({
      query: ({ page }) => ({
        url: `projects/me?page=${page || 1}`,
        method: "GET",
      }),
      providesTags: ["project-service"],
    }),
    createProject: builder.mutation<Project, CreateProjectDTO>({
      query: (data) => ({
        url: "projects/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["project-service"],
    }),
    updateProject: builder.mutation<
      Project,
      { id: string; data: UpdateProjectDTO }
    >({
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
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsService;
