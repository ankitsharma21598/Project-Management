import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { OrganizationAttributes } from '../models/Organization';
import { Organization } from '../models';
// import Organization from '../models/Organization';

/**
 * Tenant Context Middleware
 * Ensures proper multi-tenant data isolation by validating and setting organization context
 */

export interface TenantContext {
  organizationId?: string;
  organization?: OrganizationAttributes;
}

/**
 * Main tenant context middleware
 * Validates organization ID from headers and attaches it to the request
 */
export function tenantContextMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get organization ID from request headers
    const organizationId = req.headers['x-organization-id'] as string;

    // Attach organization ID to request if present
    if (organizationId) {
      req.organizationId = organizationId;
    }

    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Tenant context middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process tenant context'
    });
  }
}

/**
 * Strict tenant validation middleware
 * Requires organization ID to be present in the request
 * Use this for routes that MUST have organization context
 */
export function requireTenantContext(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void {
  const organizationId = req.headers['x-organization-id'] as string;

  if (!organizationId) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Organization ID is required. Please provide x-organization-id header.'
    });
  }

  req.organizationId = organizationId;
  next();
}

/**
 * Validates if the organization exists in database
 * Use this for critical operations that require verified organization
 */
export async function validateTenantExists(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const organizationId = req.organizationId || req.headers['x-organization-id'] as string;

    if (!organizationId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Organization ID is required'
      });
    }

    // Check if organization exists
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Organization not found'
      });
    }

    // Attach full organization object to request
    req.organizationId = organizationId;
    (req as any).organization = organization;

    next();
  } catch (error) {
    console.error('Organization validation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to validate organization'
    });
  }
}

/**
 * Helper function to get organization ID from request
 * Centralizes the logic for extracting organization ID
 */
export function getOrganizationId(req: AuthRequest): string | undefined {
  return req.organizationId || req.headers['x-organization-id'] as string;
}

/**
 * Helper function to verify tenant access
 * Checks if the requested resource belongs to the user's organization
 */
export async function verifyTenantAccess(
  resourceOrganizationId: string,
  requestOrganizationId?: string
): Promise<boolean> {
  if (!requestOrganizationId) {
    return false;
  }

  return resourceOrganizationId === requestOrganizationId;
}

/**
 * Middleware to log tenant context for debugging
 * Useful in development to track which organization is making requests
 */
export function logTenantContext(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const organizationId = getOrganizationId(req);
  
  if (organizationId) {
    console.log(`[Tenant Context] Request from organization: ${organizationId}`);
    console.log(`[Tenant Context] Path: ${req.path}`);
    console.log(`[Tenant Context] Method: ${req.method}`);
  } else {
    console.log('[Tenant Context] No organization context in request');
  }

  next();
}

/**
 * Extract and validate tenant context for GraphQL operations
 * Returns a context object to be used in GraphQL resolvers
 */
export function extractTenantContext(req: AuthRequest): TenantContext {
  const organizationId = getOrganizationId(req);

  return {
    organizationId,
    organization: (req as any).organization
  };
}

/**
 * Middleware factory to create tenant-specific routes
 * Useful for creating organization-scoped API endpoints
 */
export function createTenantRoute(
  requireOrganization: boolean = false,
  validateExists: boolean = false
) {
  const middlewares = [tenantContextMiddleware];

  if (requireOrganization) {
    middlewares.push(requireTenantContext);
  }

  if (validateExists) {
    middlewares.push(validateTenantExists);
  }

  return middlewares;
}

/**
 * Error class for tenant-related errors
 */
export class TenantError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'TenantError';
    this.statusCode = statusCode;
  }
}

/**
 * Helper to throw tenant access errors
 */
export function throwTenantAccessError(message?: string): never {
  throw new TenantError(
    message || 'Access denied: Resource does not belong to your organization',
    403
  );
}

/**
 * Helper to throw missing tenant error
 */
export function throwMissingTenantError(): never {
  throw new TenantError(
    'Organization context is required for this operation',
    400
  );
}

// Export all functions and types
export default {
  tenantContextMiddleware,
  requireTenantContext,
  validateTenantExists,
  getOrganizationId,
  verifyTenantAccess,
  logTenantContext,
  extractTenantContext,
  createTenantRoute,
  TenantError,
  throwTenantAccessError,
  throwMissingTenantError
};
