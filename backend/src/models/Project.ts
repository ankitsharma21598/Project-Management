import { DataTypes, Sequelize, Optional } from 'sequelize';

/* =======================
   Interfaces (Same File)
======================= */

export interface ProjectAttributes {
  id: string;
  organizationId: string;
  name: string;
  status: string;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  'id' | 'status' | 'description' | 'dueDate' | 'createdAt' | 'updatedAt'
>;

/* =======================
   Model Factory Function
======================= */

export default function ProjectModel(sequelize: Sequelize) {
  const Project = sequelize.define<
    any,
    ProjectCreationAttributes
  >(
    'Project',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'organization_id'
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: 'PLANNING'
      },

      description: {
        type: DataTypes.TEXT
      },

      dueDate: {
        type: DataTypes.DATE, 
        field: 'due_date'
      },

    },
    {
      tableName: 'projects',
      timestamps: true,
      underscored: true,
    }
  );

  return Project;
}
