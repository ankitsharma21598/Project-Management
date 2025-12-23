import {Project} from '../models';
import { CreateProjectInput, UpdateProjectInput, Context } from '../types';
import { validateRequired, validateProjectStatus, validateDate } from '../utils/validators';
import { calculateTaskStats } from '../utils/helpers';
import { ProjectAttributes } from '../models/Project';

export async function getAllProjects(organizationId: string) {
  return await Project.findAll({
    where: { organizationId },
    include: ['tasks'],
    order: [['createdAt', 'DESC']]
  });
}

export async function getProjectById(id: string, context: Context) {
  const project = await Project.findByPk(id, {
    include: ['organization', 'tasks']
  });

  if (project && context.organizationId && project.organizationId !== context.organizationId) {
    throw new Error('Unauthorized: Project does not belong to your organization');
  }

  return project;
}

export async function createProject(
  input: CreateProjectInput,
  context: Context
): Promise<ProjectAttributes> {
  // Validate input
  validateRequired(input.organizationId, 'Organization ID');
  validateRequired(input.name, 'Project name');

  // Check organization access
  if (context.organizationId && input.organizationId !== context.organizationId) {
    throw new Error('Unauthorized: Cannot create project for another organization');
  }

  if (input.status && !validateProjectStatus(input.status)) {
    throw new Error('Invalid project status');
  }

  if (input.dueDate && !validateDate(input.dueDate)) {
    throw new Error('Invalid due date format');
  }

  return await Project.create({
    organizationId: input.organizationId,
    name: input.name,
    status: input.status || 'planning',
    description: input.description || '',
    dueDate: input.dueDate || null
  });
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
  context: Context
): Promise<ProjectAttributes> {
  const project = await getProjectById(id, context);
  if (!project) {
    throw new Error('Project not found');
  }

  if (input.status && !validateProjectStatus(input.status)) {
    throw new Error('Invalid project status');
  }

  if (input.dueDate && !validateDate(input.dueDate)) {
    throw new Error('Invalid due date format');
  }

  await project.update(input);
  return project;
}

export async function deleteProject(id: string, context: Context): Promise<boolean> {
  const project = await getProjectById(id, context);
  if (!project) {
    throw new Error('Project not found');
  }

  await project.destroy();
  return true;
}

export async function getProjectStats(projectId: string) {
  return await calculateTaskStats(projectId);
}