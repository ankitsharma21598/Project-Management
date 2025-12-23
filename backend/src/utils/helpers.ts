import { TaskStats } from '../types/index';
import {Task} from '../models';

export async function calculateTaskStats(projectId: string): Promise<TaskStats> {
  const tasks = await Task.findAll({
    where: { projectId }
  });

  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'done').length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    completionRate: Math.round(completionRate * 100) / 100
  };
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function handleError(error: any): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unexpected error occurred');
}