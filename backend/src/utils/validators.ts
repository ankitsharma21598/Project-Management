
import { ProjectStatus, TaskStatus } from '../types/index';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function validateProjectStatus(status: string): boolean {
  return Object.values(ProjectStatus).includes(status as ProjectStatus);
}

export function validateTaskStatus(status: string): boolean {
  return Object.values(TaskStatus).includes(status as TaskStatus);
}

export function validateDate(date: string): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

export function validateRequired(value: any, fieldName: string): void {
  console.log("validateRequired ==>>",value,fieldName);
  
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} is required`);
  }
}