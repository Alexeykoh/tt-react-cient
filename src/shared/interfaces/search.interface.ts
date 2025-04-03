import { Client } from "./client.interface";
import { Project } from "./project.interface";
import { Task } from "./task.interface";
import { User } from "./user.interface";

export interface Search {
  projects: Array<Project>;
  tasks: Array<Task>;
  clients: Array<Client>;
  users: Array<User>;
}
