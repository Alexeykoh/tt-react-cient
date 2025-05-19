import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  Client,
  ClientSchema,
  CreateClientDTO,
  EditClientDTO,
} from "../interfaces/client.interface";
import { PaginatedResponse } from "../interfaces/api.interface";
import { validatePaginatedResponse, validateWithSchema } from "@/lib/validator";

export const clientService = createApi({
  reducerPath: "client-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["client-pagiated", "client-id"],
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedResponse<Client>, { page: number }>({
      query: ({ page }) => ({
        url: `clients/me?page=${page || 1}`,
        method: "GET",
      }),
      transformResponse: (response: PaginatedResponse<Client>) => {
        return validatePaginatedResponse(ClientSchema, response, "getClients");
      },
      providesTags: ["client-pagiated"],
    }),
    getClientById: builder.query<Client, { client_id: string }>({
      query: ({ client_id }) => ({
        url: `clients/${client_id}`,
        method: "GET",
      }),
      providesTags: ["client-id"],
      transformResponse: (response: { data: Client }) => {
        return validateWithSchema<Client>(
          ClientSchema,
          response.data,
          "getClientById"
        );
      },
    }),
    createClient: builder.mutation<Client, CreateClientDTO>({
      query: (data) => ({
        url: `clients`,
        method: "POST",
        body: {
          name: data.name,
          contact_info: data.contact_info,
        },
      }),
      invalidatesTags: ["client-pagiated"],
    }),
    editClients: builder.mutation<Client, EditClientDTO>({
      query: (data) => ({
        url: `clients/${data.client_id}`,
        method: "PATCH",
        body: {
          name: data.name,
          contact_info: data.contact_info,
        },
      }),
      invalidatesTags: ["client-pagiated"],
    }),
    deletelients: builder.mutation<Client, { id: string }>({
      query: ({ id }) => ({
        url: `clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["client-pagiated"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useEditClientsMutation,
  useDeletelientsMutation,
} = clientService;
