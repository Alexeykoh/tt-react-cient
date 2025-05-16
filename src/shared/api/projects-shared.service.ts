import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  FriendsOnProject,
  FriendsOnProjectSchema,
  GetProjectSharedMembersDTO,
  ProjectInvitations,
  ProjectInvitationsSchema,
  ProjectShared,
  ProjectSharedCreateDTO,
  ProjectSharedDeleteDTO,
  ProjectSharedPatchDTO,
  ProjectSharedSchema,
} from "../interfaces/project-shared.interface";
import { validateWithSchema } from "@/lib/validator";
import { z } from "zod";

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
    "project-shared-filter",
    "project-shared-member",
  ],
  endpoints: (builder) => ({
    getProjectsShared: builder.query<Array<ProjectShared>, void>({
      query: () => ({
        url: `projects/shared`,
        method: "GET",
      }),
      transformResponse: (response: { data: Array<ProjectShared> }) => {
        return validateWithSchema<Array<ProjectShared>>(
          z.array(ProjectSharedSchema),
          response.data,
          "getProjectsShared"
        );
      },
      providesTags: ["project-shared-service"],
    }),

    getProjectsSharedByMemberId: builder.query<
      ProjectShared,
      { member_id: string }
    >({
      query: ({ member_id }) => ({
        url: `projects/shared/member/${member_id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ProjectShared }) => {
        return validateWithSchema<ProjectShared>(
          ProjectSharedSchema,
          response.data,
          "getProjectsSharedByMemberId"
        );
      },
      providesTags: ["project-shared-member"],
    }),

    getProjectsSharedFilter: builder.query<
      Array<ProjectShared>,
      GetProjectSharedMembersDTO
    >({
      query: ({ role, project_id }) => ({
        url: `projects/shared/project-members/${project_id}?role=${role}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Array<ProjectShared> }) => {
        return validateWithSchema<Array<ProjectShared>>(
          z.array(ProjectSharedSchema),
          response.data,
          "getProjectsShared"
        );
      },
      providesTags: ["project-shared-filter"],
    }),

    getProjectsSharedInvations: builder.query<Array<ProjectInvitations>, void>({
      query: () => ({
        url: `projects/shared/invitations`,
        method: "GET",
      }),
      transformResponse: (response: { data: Array<ProjectInvitations> }) => {
        return validateWithSchema<Array<ProjectInvitations>>(
          z.array(ProjectInvitationsSchema),
          response.data,
          "getProjectsSharedInvations"
        );
      },
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
      transformResponse: (response: { data: Array<FriendsOnProject> }) => {
        return validateWithSchema<Array<FriendsOnProject>>(
          z.array(FriendsOnProjectSchema),
          response.data,
          "getFriendsOnProject"
        );
      },
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
      transformResponse: (response: { data: Array<ProjectShared> }) => {
        return validateWithSchema<Array<ProjectShared>>(
          z.array(ProjectSharedSchema),
          response.data,
          "getProjectSharedById"
        );
      },
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
    leaveProjectShared: builder.mutation<
      void,
      { project_id: string; member_id: string }
    >({
      query: ({ project_id, member_id }) => ({
        url: `projects/shared/leave/${project_id}/${member_id}`,
        method: "POST",
      }),
      invalidatesTags: [
        "project-shared-service",
        "project-shared-id-service",
        "friends-on-project",
      ],
    }),
    patchProjectMember: builder.mutation<
      void,
      { project_id: string; member_id: string; data: ProjectSharedPatchDTO }
    >({
      query: ({ project_id, member_id, data }) => ({
        url: `projects/shared/${project_id}/${member_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [
        "project-shared-service",
        "project-shared-id-service",
        "friends-on-project",
        "project-shared-member",
      ],
    }),
  }),
});

export const {
  useGetProjectsSharedQuery,
  useGetProjectsSharedByMemberIdQuery,
  useGetProjectSharedByIdQuery,
  useGetFriendsOnProjectQuery,
  useGetProjectsSharedInvationsQuery,
  useGetProjectsSharedFilterQuery,
  useApproveProjectSharedInvationMutation,
  useCreateProjectSharedMutation,
  useChangeRoleProjectSharedMutation,
  useDeleteRoleProjectSharedMutation,
  useLeaveProjectSharedMutation,
  usePatchProjectMemberMutation,
} = projectsSharedService;
