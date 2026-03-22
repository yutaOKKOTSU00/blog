import express from 'express';
import Post from '../models/post.js';
import { validatePost, validatePostUpdate, validatePostQuery, validatePostId } from '../validators/post.js';

const router = express.Router();

// Create a new post
router.post('/', validatePost, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      published: req.body.published,
      user_id: req.body.user_id 
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts with optional filtering
router.get('/', validatePostQuery, async (req, res) => {
  try {
    const where = {};

    // Add published filter if provided
    if (req.query.published !== undefined) {
      where.published = req.query.published;
    }

    const posts = await Post.findAll({ 
      where,
      order: [['created_at', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get a specific post by ID
router.get('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update a specific post
router.put('/:id', validatePostId, validatePostUpdate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }

    // Update post fields
    post.title = req.body.title;
    post.content = req.body.content;

    // Only update published status if provided
    if (req.body.published !== undefined) {
      post.published = req.body.published;
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a specific post
router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }

    await post.destroy();

    // Return 204 No Content on successful deletion
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
