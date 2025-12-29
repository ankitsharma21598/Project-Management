import { Context } from '../types';
import * as organizationService from '../services/organizationService';
import * as projectService from '../services/projectService';
import * as taskService from '../services/taskService';
import * as commentService from '../services/commentService';
import * as authService from '../services/authService';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { toSafeUser } from '../utils/userHelpers';

// Helper function to require authentication
function requireAuth(context: Context): string {

  if (!context.userId) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  return context.userId;
}

export const resolvers = {
  Query: {
     // ========== Auth Queries ==========
    me: async (_: any, __: any, context: Context) => {
      const userId = requireAuth(context);
      const user = await authService.getCurrentUser(userId);
      
      if (!user) {
        throw new GraphQLError('User not found');
      }
       const plainUser = user.toJSON();
      return toSafeUser(plainUser);
    },

    // ========== User Queries ==========
    user: async (_: any, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      const user = await authService.getCurrentUser(id);
      if (!user) {
        throw new GraphQLError('User not found');
      }
      const plainUser = user.toJSON();
      return toSafeUser(plainUser);
    },

    users: async (_: any, __: any, context: Context) => {
      requireAuth(context);
      // Implement user listing logic based on permissions
      throw new GraphQLError('Not implemented');

    },

    organizationUsers: async (_: any, { organizationId }: { organizationId: string }, context: Context) => {
      requireAuth(context);
      
      if (context.organizationId !== organizationId) {
        throw new GraphQLError('Unauthorized access');
      }
      return await authService.getUsersByOrganization(organizationId);
    },


    // Organization queries
    organization: async (_: any, { id }: { id: string }) => {
      return await organizationService.getOrganizationById(id);
    },

    organizations: async () => {
      return await organizationService.getAllOrganizations();
    },

    // Project queries
    project: async (_: any, { id }: { id: string }, context: Context) => {
      return await projectService.getProjectById(id, context);
    },

    projects: async (_: any, { organizationId }: { organizationId: string }, context: Context) => {
      
      if (context.organizationId && organizationId !== context.organizationId) {
        throw new Error('Unauthorized');
      }
      
      return await projectService.getAllProjects(organizationId);
    },

    // Task queries
    task: async (_: any, { id }: { id: string }) => {
      return await taskService.getTaskById(id);
    },

    tasks: async (_: any, { projectId }: { projectId: string }) => {
      return await taskService.getAllTasks(projectId);
    },

    // Comment queries
    comments: async (_: any, { taskId }: { taskId: string }) => {
      return await commentService.getCommentsByTask(taskId);
    }
  },

  Mutation: {

     // ========== Auth Mutations ==========
    signup: async (_: any, args: any) => {
      return await authService.signup(args);
    },

    signin: async (_: any, args: any) => {
      return await authService.signin(args);
    },

    updateProfile: async (_: any, args: any, context: Context) => {
      const userId = requireAuth(context);
      const user = await authService.updateUserProfile(userId, args);
      return toSafeUser(user);
    },

    changePassword: async (_: any, args: any, context: Context) => {
      const userId = requireAuth(context);
      await authService.changePassword(userId, args.currentPassword, args.newPassword);
      return true;
    },

    // Organization mutations
    createOrganization: async (_: any, args: any) => {
      return await organizationService.createOrganization(args);
    },

    updateOrganization: async (_: any, args: any) => {
      console.log("Params ==> ",args);
      const { id, input } = args;
      return await organizationService.updateOrganization(id, input);
    },

    deleteOrganization: async (_: any, { id }: { id: string }) => {
      return await organizationService.deleteOrganization(id);
    },

    // Project mutations
    createProject: async (_: any, args: any, context: Context) => {
      return await projectService.createProject(args, context);
    },

    updateProject: async (_: any, args: any, context: Context) => {
      console.log("Params ==> ",args);
      const { id, input } = args;
      return await projectService.updateProject(id, input, context);
    },

    deleteProject: async (_: any, { id }: { id: string }, context: Context) => {
      return await projectService.deleteProject(id, context);
    },

    // Task mutations
    createTask: async (_: any, args: any) => {
      return await taskService.createTask(args);
    },

    updateTask: async (_: any, args: any, context: Context) => {
      console.log("Params ==> ",args);
      const { id, input } = args;
      return await taskService.updateTask(id, input);
    },

    updateTaskStatus: async (_: any, args: any, context: Context) => {
      console.log("Params ==> ",args);
      const { id, status } = args;
      return await taskService.updateTaskStatus(id, status);
    },

    deleteTask: async (_: any, { id }: { id: string }) => {
      return await taskService.deleteTask(id);
    },

    // Comment mutations
    addTaskComment: async (_: any, args: any) => {
      console.log("Params ==>",args);
      
      return await commentService.createComment(args);
    },

    deleteTaskComment: async (_: any, { id }: { id: string }) => {
      return await commentService.deleteComment(id);
    }
  },

  // ========== Field Resolvers ==========
  User: {
    organization: async (parent: any) => {
      if (!parent.organizationId) return null;
      return await organizationService.getOrganizationById(parent.organizationId);
    },

    createdAt: (parent: any) => parent.createdAt.toISOString(),

    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  },

  // Field resolvers
  Organization: {
    projects: async (parent: any) => {
      return await projectService.getAllProjects(parent.id);
    },

    createdAt: (parent: any) => parent.createdAt.toISOString(),

    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  },

  Project: {
    status: (parent: any) => parent.status.toUpperCase(),

    dueDate: (parent: any) => {
      if (parent.dueDate) {
        return parent.dueDate.toISOString();
      }
      return null;
    },

    createdAt: (parent: any) => parent.createdAt.toISOString(),

    updatedAt: (parent: any) => parent.updatedAt.toISOString(),

    organization: async (parent: any) => {
      return await organizationService.getOrganizationById(parent.organizationId);
    },

    tasks: async (parent: any) => {
      return await taskService.getAllTasks(parent.id);
    },

    taskStats: async (parent: any) => {
      return await projectService.getProjectStats(parent.id);
    }
  },

  Task: {
    status: (parent: any) => parent.status.toUpperCase(),

    project: async (parent: any) => {
      return await projectService.getProjectById(parent.projectId, {});
    },

    comments: async (parent: any) => {
      return await commentService.getCommentsByTask(parent.id);
    },

    createdAt: (parent: any) => parent.createdAt.toISOString(),

    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  },

  TaskComment: {
    task: async (parent: any) => {
      return await taskService.getTaskById(parent.taskId);
    },

    createdAt: (parent: any) => parent.createdAt.toISOString(),

    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  }
};