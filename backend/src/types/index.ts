export interface Context {
  organizationId?: string;
  userId?: string;
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
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