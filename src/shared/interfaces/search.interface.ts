import { z } from "zod";
import { ClientSchema } from "./client.interface";
import { ProjectSchema } from "./project.interface";
import { TaskSchema } from "./task.interface";
import { UserSchema } from "./user.interface";

export const SearchSchema = z.object({
  projects: z.array(ProjectSchema),
  tasks: z.array(TaskSchema),
  clients: z.array(ClientSchema),
  users: z.array(UserSchema),
});

export type Search = z.infer<typeof SearchSchema>;
