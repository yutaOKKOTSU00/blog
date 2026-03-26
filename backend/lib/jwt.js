import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const JWT_EXPIRY = '7d';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(`Invalid or expired token: ${error.message}`);
  }
}

export function decodeToken(token) {
  return jwt.decode(token);
}
