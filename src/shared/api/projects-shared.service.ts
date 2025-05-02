import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  ProjectShared,
  ProjectSharedCreateDTO,
} from "../interfaces/project-shared.interface";

export interface CreateProjectRequest {
  name: string;
  currency_id: string;
  rate: number;
  tag_ids: string[];
  client_id: string | null;
}

export interface UpdateProjectRequest {
  name?: string;
  currency_id?: string;
  rate?: number;
}

export const projectsSharedService = createApi({
  reducerPath: "project-shared-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["project-shared-service", "project-shared-id-service"],
  endpoints: (builder) => ({
    getProjectsShared: builder.query<Array<ProjectShared>, void>({
      query: () => ({
        url: `projects/shared`,
        method: "GET",
      }),
      transformResponse: (response: { data: Array<ProjectShared> }) =>
        response.data,
      providesTags: ["project-shared-service"],
    }),
    getProjectSharedById: builder.query<
      Array<ProjectShared>,
      { project_id: string }
    >({
      query: ({ project_id: id }) => ({
        url: `projects/shared/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Array<ProjectShared> }) =>
        response.data,
      providesTags: ["project-shared-id-service"],
    }),
    createProjectShared: builder.mutation<
      ProjectShared,
      ProjectSharedCreateDTO
    >({
      query: ({ project_id, ...data }) => ({
        url: `projects/shared/${project_id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["project-shared-service"],
    }),
    approveProjectSharedInvation: builder.mutation<
      ProjectShared,
      { project_id: string }
    >({
      query: ({ project_id }) => ({
        url: `projects/shared/${project_id}/approve-invitation`,
        method: "POST",
      }),
      invalidatesTags: ["project-shared-service"],
    }),
    changeRoleProjectShared: builder.mutation<void, ProjectSharedCreateDTO>({
      query: ({ project_id, ...data }) => ({
        url: `projects/shared/${project_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["project-shared-service"],
    }),
  }),
});

export const {
  useGetProjectsSharedQuery,
  useGetProjectSharedByIdQuery,
  useCreateProjectSharedMutation,
  useApproveProjectSharedInvationMutation,
  useChangeRoleProjectSharedMutation,
} = projectsSharedService;
