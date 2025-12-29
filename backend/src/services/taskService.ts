// import Task from '../models/Task';
import { Task } from '../models';
import {Project} from '../models';
import { TaskAttributes } from '../models/Task';
import {  CreateTaskInput, UpdateTaskInput, Context } from '../types/index';
import { validateRequired, validateTaskStatus, validateEmail } from '../utils/validators';

export async function getAllTasks(projectId: string): Promise<TaskAttributes[]> {
  return await Task.findAll({
    where: { projectId },
    include: ['comments'],
    order: [['createdAt', 'DESC']]
  });
}

export async function getTaskById(id: string): Promise<TaskAttributes | null> {
  return await Task.findByPk(id, {
    include: ['project', 'comments']
  });
}

export async function createTask({ input }:{input: CreateTaskInput}): Promise<TaskAttributes> {
  // Validate input
  validateRequired(input.projectId, 'Project ID');
  validateRequired(input.title, 'Task title');

  // Check if project exists
  const project = await Project.findByPk(input.projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (input.status && !validateTaskStatus(input.status)) {
    throw new Error('Invalid task status');
  }

  if (input.assigneeEmail && !validateEmail(input.assigneeEmail)) {
    throw new Error('Invalid assignee email format');
  }

  return await Task.create({
  projectId: input.projectId,
  title: input.title,
  description: input.description,
  status: input.status ?? 'TODO',
  assigneeEmail: input.assigneeEmail,
});
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<TaskAttributes> {
  
  console.log("Params ==> ",id,input);
  
  const task = await getTaskById(id);
  if (!task) {
    throw new Error('Task not found');
  }

  console.log("Task ===>",input.title);
  

  if (input.status && !validateTaskStatus(input.status)) {
    throw new Error('Invalid task status');
  }

  if (input.assigneeEmail && !validateEmail(input.assigneeEmail)) {
    throw new Error('Invalid assignee email format');
  }


  await Task.update({
    title: input.title,
    description: input.description,
    status: input.status,
    assigneeEmail: input.assigneeEmail,
  }, {
    where: { id },
  });
  return task;
}

export async function updateTaskStatus(id: string, status: string): Promise<TaskAttributes> {
  const task = await getTaskById(id);
  if (!task) {
    throw new Error('Task not found');
  }

  if (!validateTaskStatus(status)) {
    throw new Error('Invalid task status');
  }

  await Task.update({ status }, { where: { id } });
  return task;
}

export async function deleteTask(id: string): Promise<boolean> {
  const task = await getTaskById(id);
  if (!task) {
    throw new Error('Task not found');
  }

  await Task.destroy({ where: { id } });
  return true;
}