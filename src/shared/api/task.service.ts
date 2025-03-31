import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

import {
  CreateTaskDto,
  UpdateTaskDto,
  AssignUserDto,
  Task,
} from "../interfaces/task.interface";

export const taskService = createApi({
  reducerPath: "task-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["task"],
  endpoints: (builder) => ({
    getTasksByProject: builder.query<Task[], string>({
      query: (projectId) => ({
        url: `tasks/${projectId}/tasks`,
        method: "GET",
      }),
      transformResponse: (response: { data: Task[] }) => response.data,
      providesTags: ["task"],
    }),
    getTaskById: builder.query<Task, string>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "GET",
      }),
      providesTags: ["task"],
    }),
    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (newTask) => ({
        url: "tasks/create",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["task"],
    }),
    updateTask: builder.mutation<
      Task,
      { taskId: string; updateData: UpdateTaskDto }
    >({
      query: ({ taskId, updateData }) => ({
        url: `tasks/${taskId}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["task"],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["task"],
    }),
    assignUserToTask: builder.mutation<
      void,
      { taskId: string; userData: AssignUserDto }
    >({
      query: ({ taskId, userData }) => ({
        url: `tasks/shared/${taskId}`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["task"],
    }),
    removeUserFromTask: builder.mutation<
      void,
      { taskId: string; userId: string }
    >({
      query: ({ taskId, userId }) => ({
        url: `tasks/shared/${taskId}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["task"],
    }),
  }),
});

export const {
  useGetTasksByProjectQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAssignUserToTaskMutation,
  useRemoveUserFromTaskMutation,
} = taskService;
