import { z } from "zod";

// NotesSchema
export const NotesSchema = z.object({
  notes_id: z.string(),
  name: z.string(),
  text_content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// CreateNotesDTOSchema
export const CreateNotesDTOSchema = z.object({
  name: z.string(),
  text_content: z.string(),
});

export type Notes = z.infer<typeof NotesSchema>;
export type CreateNotesDTO = z.infer<typeof CreateNotesDTOSchema>;
export type EditNotesDTO = CreateNotesDTO;
