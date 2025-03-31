export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;
}

export interface AssignUserDto {
  taskId: string;
  userId: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate?: Date;
}

export interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}
