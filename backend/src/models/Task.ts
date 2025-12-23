import { DataTypes, Sequelize, Optional } from 'sequelize';

export interface TaskAttributes {
  id: string;
  projectId: string;
  title: string;
  status: string;
  description?: string;
  assigneeEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCreationAttributes = Optional<
  TaskAttributes,
  'id' | 'status' | 'description' | 'assigneeEmail' | 'createdAt' | 'updatedAt'
>;

export default function TaskModel(sequelize: Sequelize) {
  const Task = sequelize.define<any, TaskCreationAttributes>(
    'Task',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'project_id'
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: 'TODO'
      },

      description: DataTypes.TEXT,

      assigneeEmail: {
        type: DataTypes.STRING,
        field: 'assignee_email'
      },

     
    },
    {
      tableName: 'tasks',
      timestamps: true,
      underscored: true,
    }
  );

  return Task;
}
