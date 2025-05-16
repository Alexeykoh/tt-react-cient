import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  LatestLog,
  LatestLogSchema,
  TimeLog,
  TimeLogSchema,
} from "../interfaces/time-log.interface";
import { PaginatedResponse } from "../interfaces/api.interface";
import { validateWithSchema } from "@/lib/validator";

export const timeLogService = createApi({
  reducerPath: "time-log-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "time-log-service",
    "time-log-service-logs",
    "time-log-service-list",
    "time-log-service-latest",
    "time-log-service-lates-task",
  ],
  endpoints: (builder) => ({
    getTimeLogById: builder.query<TimeLog, { id: string }>({
      query: ({ id }) => ({
        url: `time-logs/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(TimeLogSchema, response.data);
      },
      providesTags: ["time-log-service"],
    }),
    getTimeLogLatestTask: builder.query<TimeLog, { task_id: string }>({
      query: ({ task_id: id }) => ({
        url: `time-logs/${id}/latest`,
        method: "GET",
      }),
      providesTags: ["time-log-service-lates-task"],
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(
          TimeLogSchema,
          response.data,
          "getTimeLogLatestTask"
        );
      },
    }),
    getTimeLogLogs: builder.query<
      PaginatedResponse<TimeLog>,
      { task_id: string }
    >({
      query: ({ task_id: id }) => ({
        url: `time-logs/${id}/logs`,
        method: "GET",
      }),
      // transformResponse: (response: { data: PaginatedResponse<TimeLog> }) =>
      //   response.data,
      providesTags: ["time-log-service-logs"],
    }),
    getTimeLogLatest: builder.query<LatestLog, void>({
      query: () => ({
        url: `time-logs/latest`,
        method: "GET",
      }),
      transformResponse: (response: { data: LatestLog }) => {
        return validateWithSchema<LatestLog>(
          LatestLogSchema,
          response.data,
          "getTimeLogLatest"
        );
      },
      providesTags: ["time-log-service-latest"],
    }),
    postTimeLogStart: builder.mutation<TimeLog, { task_id: string }>({
      query: ({ task_id }) => ({
        url: `time-logs/${task_id}/start`,
        method: "POST",
        providesTags: ["ttime-log-service-lates-task"],
      }),
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(
          TimeLogSchema,
          response.data,
          "postTimeLogStart"
        );
      },
      invalidatesTags: [
        "time-log-service",
        "time-log-service-logs",
        "time-log-service-list",
        "time-log-service-latest",
        "time-log-service-lates-task",
      ],
    }),
    postTimeLogStop: builder.mutation<
      TimeLog,
      { task_id: string; client_time: string }
    >({
      query: ({ task_id, client_time }) => ({
        url: `time-logs/${task_id}/stop?client_time=${client_time}`,
        method: "PATCH",
        providesTags: ["ttime-log-service-lates-task"],
      }),
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(
          TimeLogSchema,
          response.data,
          "postTimeLogStop"
        );
      },
      invalidatesTags: [
        "time-log-service",
        "time-log-service-logs",
        "time-log-service-list",
        "time-log-service-latest",
        "time-log-service-lates-task",
      ],
    }),
  }),
});

export const {
  useGetTimeLogByIdQuery,
  useGetTimeLogLogsQuery,
  useGetTimeLogLatestQuery,
  usePostTimeLogStartMutation,
  usePostTimeLogStopMutation,
  useGetTimeLogLatestTaskQuery,
} = timeLogService;
