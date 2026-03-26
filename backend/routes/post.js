import express from 'express';
import { Post, User } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { validatePost, validatePostUpdate, validatePostQuery, validatePostId } from '../validators/post.js';

const router = express.Router();

// Create post (auth required)
router.post('/', authMiddleware, validatePost, async (req, res) => {
  try {
    const post = await Post.create({
      title:     req.body.title,
      content:   req.body.content,
      published: req.body.published ?? true,
      user_id:   req.user.id,  // vient du JWT
    });

    // Recharger avec l'auteur
    const fullPost = await Post.findByPk(post.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts (public)
router.get('/', validatePostQuery, async (req, res) => {
  try {
    const where = {};
    if (req.query.published !== undefined) where.published = req.query.published;

    const posts = await Post.findAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      order: [['created_at', 'DESC']],
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get post by slug (public) — DOIT être avant /:id
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug },
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });
    if (!post) {
      return res.status(404).json({ error: `Post with slug "${req.params.slug}" not found` });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Get post by ID (public)
router.get('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update post (auth required + ownership)
router.put('/:id', authMiddleware, validatePostId, validatePostUpdate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }

    // vérification du propriétaire
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: you can only edit your own posts' });
    }

    if (req.body.title     !== undefined) post.title     = req.body.title;
    if (req.body.content   !== undefined) post.content   = req.body.content;
    if (req.body.published !== undefined) post.published = req.body.published;

    await post.save();

    const fullPost = await Post.findByPk(post.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });

    res.json(fullPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post (auth required + ownership)
router.delete('/:id', authMiddleware, validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: you can only delete your own posts' });
    }

    await post.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
