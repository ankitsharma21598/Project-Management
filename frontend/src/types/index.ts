export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId: string;
  role: string;
}

export interface Organization {
  id: string;
  name: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  dueDate?: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeEmail?: string;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD" | "ARCHIVED" | "PLANNING";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";

export interface CreateProjectInput {
  name: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  dueDate?: string;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  assigneeEmail?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeEmail?: string;
}
