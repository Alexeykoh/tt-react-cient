import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { PaginatedResponse } from "../interfaces/api.interface";
import {
  CreateNotesDTO,
  EditNotesDTO,
  Notes,
  NotesSchema,
} from "../interfaces/notes.interface";
import { validatePaginatedResponse, validateWithSchema } from "@/lib/validator";

export const notesService = createApi({
  reducerPath: "notes-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["notes-pagiated", "notes-id"],
  endpoints: (builder) => ({
    getNotes: builder.query<PaginatedResponse<Notes>, { page: number }>({
      query: ({ page }) => ({
        url: `notes/me?page=${page || 1}`,
        method: "GET",
      }),
      transformResponse: (response: PaginatedResponse<Notes>) => {
        return validatePaginatedResponse(NotesSchema, response, "getNotes");
      },
      providesTags: ["notes-pagiated"],
    }),
    getNotesById: builder.query<Notes, { note_id: string }>({
      query: ({ note_id }) => ({
        url: `notes/${note_id}`,
        method: "GET",
      }),
      providesTags: ["notes-id"],
      transformResponse: (response: { data: Notes }) => {
        return validateWithSchema<Notes>(
          NotesSchema,
          response.data,
          "getNotesById"
        );
      },
    }),
    createNotes: builder.mutation<Notes, CreateNotesDTO>({
      query: (data) => ({
        url: `notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notes-pagiated"],
    }),
    editNotes: builder.mutation<Notes, { note_id: string } & EditNotesDTO>({
      query: ({ note_id, ...data }) => ({
        url: `notes/${note_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["notes-pagiated", "notes-id"],
    }),
    deleteNotes: builder.mutation<Notes, { id: string }>({
      query: ({ id }) => ({
        url: `notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notes-pagiated"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNotesByIdQuery,
  useEditNotesMutation,
  useCreateNotesMutation,
  useDeleteNotesMutation,
} = notesService;
