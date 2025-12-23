import { DataTypes, Sequelize, Optional } from 'sequelize';

/* =======================
   Interfaces (Same File)
======================= */

export interface OrganizationAttributes {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationCreationAttributes = Optional<
  OrganizationAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

/* =======================
   Model Factory Function
======================= */

export default function OrganizationModel(sequelize: Sequelize) {
  const Organization = sequelize.define<
    any,
    OrganizationCreationAttributes
  >(
    'Organization',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        field: 'contact_email'
      },
    },
    {
      tableName: 'organizations',
      timestamps: true,
      underscored: true,
    }
  );

  return Organization;
}
