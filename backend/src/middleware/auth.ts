import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../config/env';

/**
 * Extended Request interface with authentication properties
 */
export interface AuthRequest extends Request {
  userId?: string;
  organizationId?: string;
  userEmail?: string;
  userRole?: string;
  token?: string;
}

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  userId: string;
  email: string;
  organizationId?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * User authentication data
 */
export interface AuthUser {
  id: string;
  email: string;
  organizationId?: string;
  role?: string;
}

/**
 * Basic authentication middleware
 * Extracts user information from headers (for demo/development)
 * In production, this should validate JWT tokens
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extract authentication information from headers
    const userId = req.headers['x-user-id'] as string;
    const organizationId = req.headers['x-organization-id'] as string;
    const userEmail = req.headers['x-user-email'] as string;
    const userRole = req.headers['x-user-role'] as string;

    // Attach user information to request
    if (userId) {
      req.userId = userId;
    }

    if (organizationId) {
      req.organizationId = organizationId;
    }

    if (userEmail) {
      req.userEmail = userEmail;
    }

    if (userRole) {
      req.userRole = userRole;
    }

    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication processing failed'
    });
  }
}

/**
 * JWT Authentication Middleware
 * Validates JWT token from Authorization header
 * Use this in production instead of basic authMiddleware
 */
export function jwtAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(); // Continue without authentication (optional auth)
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

    // Attach user information to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.organizationId = decoded.organizationId;
    req.userRole = decoded.role;
    req.token = token;
    

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired'
      });
    }

    console.error('JWT auth error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Require authentication middleware
 * Ensures user is authenticated before proceeding
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  next();
}

/**
 * Require specific role middleware
 * Ensures user has required role before proceeding
 */
export function requireRole(roles: string | string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}

/**
 * Optional authentication middleware
 * Attempts to authenticate but continues even if authentication fails
 */
export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.organizationId = decoded.organizationId;
    req.userRole = decoded.role;
    req.token = token;
  } catch (error) {
    // Silently fail and continue without authentication
    console.log('Optional auth failed, continuing without authentication');
  }

  next();
}

/**
 * Generate JWT token
 * Creates a signed JWT token with user information
 */
export function generateToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role
  };

  let token = jwt.sign(payload, config.JWT_SECRET as Secret, {
    expiresIn: config.JWT_EXPIRES_IN
  });

  return token;
}

/**
 * Verify JWT token
 * Validates and decodes a JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode JWT token without verification
 * Useful for reading token contents without validating signature
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request
 * Gets JWT token from Authorization header or other sources
 */
export function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check query parameter (not recommended for production)
  const queryToken = req.query.token as string;
  if (queryToken) {
    return queryToken;
  }

  // Check cookie (if using cookie-based auth)
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Get authenticated user from request
 * Returns user information if authenticated
 */
export function getAuthUser(req: AuthRequest): AuthUser | null {
  if (!req.userId) {
    return null;
  }

  return {
    id: req.userId,
    email: req.userEmail || '',
    organizationId: req.organizationId,
    role: req.userRole
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(req: AuthRequest): boolean {
  return !!req.userId;
}

/**
 * Check if user has specific role
 */
export function hasRole(req: AuthRequest, role: string): boolean {
  return req.userRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(req: AuthRequest, roles: string[]): boolean {
  return !!req.userRole && roles.includes(req.userRole);
}

/**
 * Check if user has all specified roles
 */
export function hasAllRoles(req: AuthRequest, roles: string[]): boolean {
  if (!req.userRole) return false;
  return roles.every(role => req.userRole === role);
}

/**
 * Refresh token middleware
 * Checks if token is about to expire and issues a new one
 */
export function refreshTokenMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    if (!req.token) {
      return next();
    }

    const decoded = decodeToken(req.token);
    if (!decoded || !decoded.exp) {
      return next();
    }

    // Check if token expires in less than 1 hour
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn < 3600) {
      // Issue new token
      const newToken = generateToken({
        id: decoded.userId,
        email: decoded.email,
        organizationId: decoded.organizationId,
        role: decoded.role
      });

      // Send new token in response header
      res.setHeader('X-New-Token', newToken);
    }

    next();
  } catch (error) {
    console.error('Token refresh error:', error);
    next();
  }
}

/**
 * Authentication error class
 */
export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Throw authentication required error
 */
export function throwAuthError(message?: string): never {
  throw new AuthError(message || 'Authentication required', 401);
}

/**
 * Throw forbidden error
 */
export function throwForbiddenError(message?: string): never {
  throw new AuthError(message || 'Access forbidden', 403);
}

/**
 * API Key authentication middleware (alternative to JWT)
 * Useful for service-to-service authentication
 */
export function apiKeyAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required'
    });
  }

  // Validate API key (implement your own validation logic)
  // This is a simple example - in production, validate against database
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
  }

  next();
}

// Export all functions and types
export default {
  authMiddleware,
  jwtAuthMiddleware,
  requireAuth,
  requireRole,
  optionalAuth,
  generateToken,
  verifyToken,
  decodeToken,
  extractToken,
  getAuthUser,
  isAuthenticated,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  refreshTokenMiddleware,
  apiKeyAuth,
  AuthError,
  throwAuthError,
  throwForbiddenError
};