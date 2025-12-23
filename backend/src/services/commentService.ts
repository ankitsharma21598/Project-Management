import { Model } from 'sequelize';
import {TaskComment} from '../models';
import {Task} from '../models';
import { CreateCommentInput } from '../types';
import { validateRequired, validateEmail } from '../utils/validators';
import { TaskAttributes } from '../models/Task';

export async function getCommentsByTask(taskId: string): Promise<Model[]> {
  return await TaskComment.findAll({
    where: { taskId },
    order: [['createdAt', 'DESC']]
  });
}

export async function getCommentById(id: string): Promise<Model | null> {
  return await TaskComment.findByPk(id, {
    include: ['task']
  });
}

export async function createComment(input: CreateCommentInput): Promise<TaskAttributes> {
  // Validate input
  validateRequired(input.taskId, 'Task ID');
  validateRequired(input.content, 'Comment content');
  validateRequired(input.authorEmail, 'Author email');

  if (!validateEmail(input.authorEmail)) {
    throw new Error('Invalid author email format');
  }

  // Check if task exists
  const task = await Task.findByPk(input.taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  return await TaskComment.create({
    taskId: input.taskId,
    content: input.content,
    authorEmail: input.authorEmail,
  });
}

export async function deleteComment(id: string): Promise<boolean> {
  const comment = await getCommentById(id);
  if (!comment) {
    throw new Error('Comment not found');
  }

  await comment.destroy();
  return true;
}