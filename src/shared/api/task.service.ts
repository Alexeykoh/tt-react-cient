import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

import {
  CreateTaskDto,
  UpdateTaskDto,
  AssignUserDto,
  Task,
  TaskStatusColumn,
  UpdateTaskStatusDto,
} from "../interfaces/task.interface";

export const taskService = createApi({
  reducerPath: "task-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["task", "task-status-column", "task-status"],
  endpoints: (builder) => ({
    getTaskStatusColumn: builder.query<TaskStatusColumn[], string>({
      query: (projectId) => ({
        url: `task-status-column/${projectId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: TaskStatusColumn[] }) =>
        response.data,
      providesTags: ["task-status-column"],
    }),
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
      transformResponse: (response: { data: Task }) => response.data,
      providesTags: ["task"],
    }),
    updateTaskStatus: builder.mutation<
      UpdateTaskStatusDto,
      UpdateTaskStatusDto
    >({
      query: (dto) => ({
        url: "task-status",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["task"], // отключаем, т.к. обновляем оптимистично
      // async onQueryStarted(updateDto, { dispatch, queryFulfilled, getState }) {
      //   // Предположим, что updateDto содержит taskId и новый статус
      //   const { task_id, task_status_column_id } = updateDto;

      //   // Оптимистично обновим кэш getTaskById
      //   const patchResult = dispatch(
      //     taskService.util.updateQueryData("getTaskById", task_id, (draft) => {
      //       draft.taskStatus.id = task_status_column_id;
      //     })
      //   );

      //   // Получаем projectId из кэша getTaskById через getState
      //   const state = getState();
      //   const getTaskByIdCache =
      //     state["task-service"].queries?.[`getTaskById("${task_id}")`]?.data;
      //   const projectId =
      //     getTaskByIdCache &&
      //     typeof getTaskByIdCache === "object" &&
      //     "project_id" in getTaskByIdCache
      //       ? getTaskByIdCache.project_id
      //       : undefined;

      //   if (typeof projectId === "string") {
      //     dispatch(
      //       taskService.util.updateQueryData("getTasksByProject", projectId, (draft) => {
      //         const task = draft.find(t => t.task_id === task_id);
      //         if (task) task.taskStatus.id = task_status_column_id;
      //       })
      //     );
      //   }

      //   try {
      //     await queryFulfilled;
      //   } catch {
      //     // Если запрос не удался - откатим изменения
      //     patchResult.undo();
      //   }
      // },
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
  useGetTaskStatusColumnQuery,
  useUpdateTaskStatusMutation,
} = taskService;
