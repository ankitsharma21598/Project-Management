import {sequelize} from '../config/database';

import OrganizationModel from './Organization';
import ProjectModel from './Project';
import TaskModel from './Task';
import TaskCommentModel from './TaskComment';
import UserModel from './User';

/* =======================
   Initialize Models
======================= */

const Organization = OrganizationModel(sequelize);
const Project = ProjectModel(sequelize);
const Task = TaskModel(sequelize);
const TaskComment = TaskCommentModel(sequelize);
const User = UserModel(sequelize);

/* =======================
   Setup Associations
======================= */

export function setupAssociations(): void {
  // User associations
  User.belongsTo(Organization, {
    foreignKey: 'organizationId',
    as: 'organization'
  });

  // Organization → Projects
  Organization.hasMany(Project, {
    foreignKey: 'organizationId',
    as: 'projects',
    onDelete: 'CASCADE'
  });

  Project.belongsTo(Organization, {
    foreignKey: 'organizationId',
    as: 'organization'
  });

  // Project → Tasks
  Project.hasMany(Task, {
    foreignKey: 'projectId',
    as: 'tasks',
    onDelete: 'CASCADE'
  });

  Task.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  // Task → Comments
  Task.hasMany(TaskComment, {
    foreignKey: 'taskId',
    as: 'comments',
    onDelete: 'CASCADE'
  });

  TaskComment.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'task'
  });
}

/* =======================
   Exports
======================= */

export {
  sequelize,
  Organization,
  Project,
  Task,
  TaskComment,
  User
};
