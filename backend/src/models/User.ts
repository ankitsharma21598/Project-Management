import { DataTypes, Sequelize, Optional, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { OrganizationAttributes } from './Organization';

/* =======================
   Interfaces (Same File)
======================= */

export type UserRole = 'admin' | 'manager' | 'member';

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationId?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  organization?: OrganizationAttributes | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'organizationId'
  | 'role'
  | 'isActive'
  | 'lastLoginAt'
  | 'createdAt'
  | 'updatedAt'
>;


/* =======================
   Model Factory Function
======================= */

export default function UserModel(sequelize: Sequelize) {
   const User = sequelize.define<any, UserCreationAttributes>(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'organization_id'
      },

      role: {
        type: DataTypes.ENUM('admin', 'manager', 'member'),
        defaultValue: 'member'
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
      },

      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at'
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (user: any) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
          
        },

        beforeUpdate: async (user: any) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    }
  );

  /* =======================
     Instance Methods
  ======================= */

  // User.comparePassword =  async function (
  //   candidatePassword: string
  // ): Promise<boolean> {
  //   return bcrypt.compare(candidatePassword, this.password);
  // };

  // User.toSafeJSON = function () {
  //   const user = this.get({ plain: true });
  //   delete user.password;
  //   return user;
  // };

  return User;
}
