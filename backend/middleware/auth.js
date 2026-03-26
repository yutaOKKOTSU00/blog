import { verifyToken } from '../lib/jwt.js';

/**
 * Middleware to verify JWT token in Authorization header
 * Extracts token from "Bearer <token>" and attaches user data to req.user
 */
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = verifyToken(token);

    // Attach user info to request for use in route handlers
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

/**
 * Optional middleware - doesn't fail if no token, just skips auth
 */
export function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      req.user = verifyToken(token);
    }
  } catch (error) {
    // Silently ignore invalid tokens in optional auth
  }

  next();
}
