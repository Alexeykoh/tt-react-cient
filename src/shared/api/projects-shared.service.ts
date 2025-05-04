import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  FriendsOnProject,
  ProjectShared,
  ProjectSharedCreateDTO,
  ProjectSharedDeleteDTO,
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
  tagTypes: [
    "project-shared-service",
    "project-shared-id-service",
    "friends-on-project",
    "project-shared-invitations",
  ],
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

    getProjectsSharedInvations: builder.query<Array<ProjectShared>, void>({
      query: () => ({
        url: `projects/shared/invitations`,
        method: "GET",
      }),
      transformResponse: (response: { data: Array<ProjectShared> }) =>
        response.data,
      providesTags: ["project-shared-invitations"],
    }),

    getFriendsOnProject: builder.query<
      Array<FriendsOnProject>,
      { project_id: string }
    >({
      query: ({ project_id }) => ({
        url: `projects/shared/friends-on-project/${project_id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Array<FriendsOnProject> }) =>
        response.data,
      providesTags: ["friends-on-project"],
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
      invalidatesTags: ["project-shared-service", "friends-on-project"],
    }),
    approveProjectSharedInvation: builder.mutation<
      ProjectShared,
      { project_id: string }
    >({
      query: ({ project_id }) => ({
        url: `projects/shared/${project_id}/approve-invitation`,
        method: "POST",
      }),
      invalidatesTags: ["project-shared-service", "friends-on-project"],
    }),
    changeRoleProjectShared: builder.mutation<void, ProjectSharedCreateDTO>({
      query: ({ project_id, ...data }) => ({
        url: `projects/shared/${project_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["project-shared-service"],
    }),
    deleteRoleProjectShared: builder.mutation<void, ProjectSharedDeleteDTO>({
      query: ({ project_id, user_id }) => ({
        url: `projects/shared/${project_id}/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "project-shared-service",
        "project-shared-id-service",
        "friends-on-project",
      ],
    }),
  }),
});

export const {
  useGetProjectsSharedQuery,
  useGetProjectSharedByIdQuery,
  useGetFriendsOnProjectQuery,
  useGetProjectsSharedInvationsQuery,
  useApproveProjectSharedInvationMutation,
  useCreateProjectSharedMutation,
  useChangeRoleProjectSharedMutation,
  useDeleteRoleProjectSharedMutation,
} = projectsSharedService;
