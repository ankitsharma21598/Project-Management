import {User} from '../models';
import {Organization} from '../models';
import { generateToken } from '../middleware/auth';
import validator from 'validator';
import { UserAttributes } from '../models/User';
import { comparePassword } from '../utils/userHelpers';
import { log } from 'node:console';

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName?: string;
  organizationSlug?: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organizationId?: string;
    role: string;
  };
}

/**
 * User signup with optional organization creation
 */
export async function signup({ input }: { input: SignupInput }): Promise<AuthResponse> {
  console.log("Input ===>",input);
  
  // Validate input
  if (!input.firstName || !input.firstName.trim()) {
    throw new Error('First name is required');
  }

  if (!input.lastName || !input.lastName.trim()) {
    throw new Error('Last name is required');
  }

  if (!input.email || !validator.isEmail(input.email)) {
    throw new Error('Valid email is required');
  }

  if (!input.password || input.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    where: { email: input.email.toLowerCase() }
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  let organizationId: string | undefined;

  // Create organization if provided
  if (input.organizationName && input.organizationSlug) {
    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(input.organizationSlug)) {
      throw new Error('Invalid organization slug format');
    }

    // Check if organization slug exists
    const existingOrg = await Organization.findOne({
      where: { slug: input.organizationSlug }
    });

    if (existingOrg) {
      throw new Error('Organization with this slug already exists');
    }

    // Create organization
    const organization = await Organization.create({
      name: input.organizationName,
      slug: input.organizationSlug,
      contactEmail: input.email.toLowerCase()
    });

    organizationId = organization.id;
  }

  // Create user
  const user = await User.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    password: input.password,
    organizationId,
    role: organizationId ? 'admin' : 'member' // First user of org is admin
  });

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role
  });

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role
    }
  };
}

/**
 * User signin
 */
export async function signin(input: SigninInput): Promise<AuthResponse> {
  console.log("Input ====>",input);
  
  // Validate input
  if (!input.email || !validator.isEmail(input.email)) {
    throw new Error('Valid email is required');
  }

  if (!input.password) {
    throw new Error('Password is required');
  }

  // Find user by email
  const user = await User.findOne({
    where: { email: input.email.toLowerCase() },
    include: [{ model: Organization, as: 'organization' }]
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Your account has been deactivated. Please contact support.');
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role
  });

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role
    }
  };
}

/**
 * Get current user by ID
 */
export async function getCurrentUser(userId: string) {
  return await User.findByPk(userId, {
    include: [{ model: Organization, as: 'organization' }]
  });
}


/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserAttributes, 'firstName' | 'lastName'>>
): Promise<UserAttributes> {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (updates.firstName) {
    user.firstName = updates.firstName;
  }

  if (updates.lastName) {
    user.lastName = updates.lastName;
  }

  await user.save();
  return user;
}

/**
 * Change user password
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Validate new password
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long');
  }

  // Update password
  user.password = newPassword;
  await user.save();
}

/**
 * Get users by organization
 */
export async function getUsersByOrganization(organizationId: string): Promise<UserAttributes[]> {
  return await User.findAll({
    where: { organizationId },
    attributes: { exclude: ['password'] }
  });
}