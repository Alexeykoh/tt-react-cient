export interface Notes {
  notes_id: string;
  name: string;
  text_content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotesDTO {
  name: string;
  text_content: string;
}
export type EditNotesDTO = CreateNotesDTO;
