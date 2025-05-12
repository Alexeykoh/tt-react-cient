import { z } from "zod";

// ClientSchema
export const ClientSchema = z.object({
  client_id: z.string(),
  name: z.string(),
  contact_info: z.string(),
});

// CreateClientDTOSchema
export const CreateClientDTOSchema = z.object({
  client_id: z.string(),
  name: z.string(),
  contact_info: z.string(),
});


export type Client = z.infer<typeof ClientSchema>;
export type CreateClientDTO = z.infer<typeof CreateClientDTOSchema>;
export type EditClientDTO = CreateClientDTO;
