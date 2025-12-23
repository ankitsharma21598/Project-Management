import { DataTypes, Sequelize, Optional } from 'sequelize';

/* =======================
   Interfaces (Same File)
======================= */

export interface TaskCommentAttributes {
  id: string;
  taskId: string;
  content: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCommentCreationAttributes = Optional<
  TaskCommentAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

/* =======================
   Model Factory Function
======================= */

export default function TaskCommentModel(sequelize: Sequelize) {
  const TaskComment = sequelize.define<
    any,
    TaskCommentCreationAttributes
  >(
    'TaskComment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'task_id'
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      authorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        field: 'author_email'
      },
    },
    {
      tableName: 'task_comments',
      timestamps: true,
      underscored: true,
    }
  );

  return TaskComment;
}
