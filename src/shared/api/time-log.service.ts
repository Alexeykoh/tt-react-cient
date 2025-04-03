import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { LatestLog, TimeLog } from "../interfaces/time-log.interface";
import { PaginatedResponse } from "../interfaces/api.interface";

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
      transformResponse: (response: { data: TimeLog }) => response.data,
      providesTags: ["time-log-service"],
    }),
    getTimeLogLatestTask: builder.query<TimeLog, { task_id: string }>({
      query: ({ task_id: id }) => ({
        url: `time-logs/${id}/latest`,
        method: "GET",
      }),
      providesTags: ["time-log-service-lates-task"],
      transformResponse: (response: { data: TimeLog }) => response.data,
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
      transformResponse: (response: { data: LatestLog }) => response.data,
      providesTags: ["time-log-service-latest"],
    }),
    postTimeLogStart: builder.mutation<TimeLog, { task_id: string }>({
      query: ({ task_id }) => ({
        url: `time-logs/${task_id}/start`,
        method: "POST",
        providesTags: ["ttime-log-service-lates-task"],
      }),
      transformResponse: (response: { data: TimeLog }) => response.data,
      invalidatesTags: [
        "time-log-service-lates-task",
        "time-log-service-latest",
      ],
    }),
    postTimeLogStop: builder.mutation<TimeLog, { task_id: string }>({
      query: ({ task_id }) => ({
        url: `time-logs/${task_id}/stop`,
        method: "PATCH",
        providesTags: ["ttime-log-service-lates-task"],
      }),
      transformResponse: (response: { data: TimeLog }) => response.data,
      invalidatesTags: [
        "time-log-service-lates-task",
        "time-log-service-latest",
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
