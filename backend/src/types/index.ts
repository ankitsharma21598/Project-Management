export interface Context {
  organizationId?: string;
  userId?: string;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

export interface TaskStats {
  total: number;
  completed: number;
  completionRate: number;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  contactEmail: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  contactEmail?: string;
}

export interface CreateProjectInput {
  organizationId: string;
  name: string;
  status?: ProjectStatus;
  description?: string;
  dueDate?: string;
}

export interface UpdateProjectInput {
  name?: string;
  status?: ProjectStatus;
  description?: string;
  dueDate?: string;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  assigneeEmail?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeEmail?: string;
}

export interface CreateCommentInput {
  taskId: string;
  content: string;
  authorEmail: string;
}