import express from 'express';
import bcrypt from 'bcrypt';
import { User, Post } from '../models/index.js';
import { validateUser, validateUserUpdate, validateUserId } from '../validators/user.js';
import { generateToken } from '../lib/jwt.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/', validateUser, async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email:    req.body.email,
      password: req.body.password,
    });
    const { password, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login — retourne aussi le role dans le token et la réponse
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // FIX: inclut le role dans le payload JWT
    const token = generateToken({
      id:       user.id,
      email:    user.email,
      username: user.username,
      role:     user.role,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Me (requires auth)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID (with their posts)
router.get('/:id', validateUserId, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post, order: [['created_at', 'DESC']] }],
    });
    if (!user) return res.status(404).json({ error: `User with ID ${req.params.id} not found` });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (auth required — only self)
router.put('/:id', authMiddleware, validateUserId, validateUserUpdate, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden: you can only update your own profile' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: `User with ID ${req.params.id} not found` });

    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.email    !== undefined) user.email    = req.body.email;
    if (req.body.password !== undefined) user.password = req.body.password;
    if (req.body.bio      !== undefined) user.bio      = req.body.bio;

    await user.save();
    const { password, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (auth required — only self)
router.delete('/:id', authMiddleware, validateUserId, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden: you can only delete your own account' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: `User with ID ${req.params.id} not found` });

    await user.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
