export interface Client {
  client_id: string;
  name: string;
  contact_info: string;
}

export interface CreateClientDTO {
  client_id: string;
  name: string;
  contact_info: string;
}
export type EditClientDTO = CreateClientDTO;
