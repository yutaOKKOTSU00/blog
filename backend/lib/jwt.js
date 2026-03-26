import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRY = '7d'; // Access token expires in 7 days

/**
 * Generate a JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {string} - JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded payload
 * @throws {Error} - If token is invalid or expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(`Invalid or expired token: ${error.message}`);
  }
}

/**
 * Decode token without verification (for inspection)
 * @param {string} token - JWT token to decode
 * @returns {Object} - Decoded payload
 */
export function decodeToken(token) {
  return jwt.decode(token);
}
