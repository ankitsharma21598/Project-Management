import { Model } from 'sequelize';
import { Organization } from '../models';
import { OrganizationAttributes } from '../models/Organization';
import { CreateOrganizationInput, UpdateOrganizationInput } from '../types';
import { validateEmail, validateSlug, validateRequired } from '../utils/validators';

export async function getAllOrganizations() {
  return await Organization.findAll({
    order: [['createdAt', 'DESC']]
  });
}

export async function getOrganizationById(id: string) {
  return await Organization.findByPk(id, {
    include: [ 'projects' ]
  });
}

export async function getOrganizationBySlug(slug: string) {
  return await Organization.findOne({
    where: { slug }
  });
}

export async function createOrganization(input: CreateOrganizationInput): Promise<OrganizationAttributes> {
  // Validate input
  validateRequired(input.name, 'Organization name');
  validateRequired(input.slug, 'Organization slug');
  validateRequired(input.contactEmail, 'Contact email');

  if (!validateEmail(input.contactEmail)) {
    throw new Error('Invalid email format');
  }

  if (!validateSlug(input.slug)) {
    throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only');
  }

  // Check if slug already exists
  const existing = await getOrganizationBySlug(input.slug);
  if (existing) {
    throw new Error('Organization with this slug already exists');
  }

  return await Organization.create({
    name: input.name,
    slug: input.slug,
    contactEmail: input.contactEmail,
    
  });
}

export async function updateOrganization(
  id: string,
  input: UpdateOrganizationInput
): Promise<OrganizationAttributes> {
  const organization = await getOrganizationById(id);
  if (!organization) {
    throw new Error('Organization not found');
  }

  if (input.contactEmail && !validateEmail(input.contactEmail)) {
    throw new Error('Invalid email format');
  }

  await organization.update(input);
  return organization;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const organization = await getOrganizationById(id);
  if (!organization) {
    throw new Error('Organization not found');
  }

  await organization.destroy();
  return true;
}