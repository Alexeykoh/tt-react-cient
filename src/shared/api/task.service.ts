import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

import {
  CreateTaskDto,
  UpdateTaskDto,
  AssignUserDto,
  Task,
  TaskStatusColumn,
  UpdateTaskStatusDto,
  UpdateTasksOrderDTO,
  TaskStatusColumnSchema,
  TaskSchema,
} from "../interfaces/task.interface";
import {validateWithSchema} from "@/lib/validator";
import { z } from "zod";

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
      transformResponse: (response: { data: TaskStatusColumn[] }) => {
        return validateWithSchema<TaskStatusColumn[]>(
          z.array(TaskStatusColumnSchema),
          response.data,
          "getTaskStatusColumn"
        );
      },
      providesTags: ["task-status-column"],
    }),

    getTasksByProject: builder.query<Task[], string>({
      query: (projectId) => ({
        url: `tasks/${projectId}/tasks`,
        method: "GET",
      }),
      transformResponse: (response: { data: Task[] }) => {
        return validateWithSchema<Task[]>(
          z.array(TaskSchema),
          response.data,
          "getTasksByProject"
        );
      },
      providesTags: ["task"],
    }),

    getTaskById: builder.query<Task, string>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Task }) => {
        return validateWithSchema<Task>(
          TaskSchema,
          response.data,
          "getTaskById"
        );
      },
      providesTags: ["task"],
    }),

    updateTaskStatus: builder.mutation<
      UpdateTaskStatusDto,
      { task_id: string; task_status_column_id: string; projectId: string }
    >({
      query: ({ task_id, task_status_column_id }) => ({
        url: "task-status",
        method: "POST",
        body: { task_id, task_status_column_id },
      }),
      // Оптимистичное обновление статуса задачи
      async onQueryStarted({ task_id, task_status_column_id, projectId }, { dispatch, queryFulfilled }) {
        // Обновляем кэш getTasksByProject
        const patchResult = dispatch(
          taskService.util.updateQueryData('getTasksByProject', projectId, (draft: Task[]) => {
            const task = draft.find(t => t.task_id === task_id);
            if (task && task.taskStatus && task.taskStatus.taskStatusColumn) {
              task.taskStatus.taskStatusColumn.id = task_status_column_id;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      // invalidatesTags: ["task"],
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
      { taskId: string; updateData: UpdateTaskDto; projectId: string }
    >({
      query: ({ taskId, updateData }) => ({
        url: `tasks/${taskId}`,
        method: "PATCH",
        body: updateData,
      }),
      // Оптимистичное обновление задачи
      async onQueryStarted({ taskId, updateData, projectId }, { dispatch, queryFulfilled }) {
        // Обновляем кэш getTasksByProject
        const patchResult = dispatch(
          taskService.util.updateQueryData('getTasksByProject', projectId, (draft: Task[]) => {
            const task = draft.find(t => t.task_id === taskId);
            if (task) {
              Object.assign(task, updateData);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      // invalidatesTags: ["task"],
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

    updateTasksOrder: builder.mutation<void, UpdateTasksOrderDTO>({
      query: (dto) => ({
        url: `tasks/order`,
        method: "PATCH",
        body: dto,
      }),
      // Оптимистичное обновление порядка задач
      async onQueryStarted(dto, { dispatch, queryFulfilled }) {
        // dto: { project_id, column_id, task_orders }
        // Обновляем кэш getTasksByProject
        const patchResult = dispatch(
          taskService.util.updateQueryData('getTasksByProject', dto.project_id, (draft: Task[]) => {
            // Обновляем order только для задач в нужной колонке
            draft
              .filter(task => task.taskStatus.taskStatusColumn.id === dto.column_id)
              .forEach(task => {
                const found = dto.task_orders.find(t => t.task_id === task.task_id);
                if (found) {
                  task.order = found.order;
                }
              });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
  useUpdateTasksOrderMutation,
} = taskService;
