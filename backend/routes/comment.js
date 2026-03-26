import express from 'express';
import { Comment, User } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateComment, validateCommentId, validatePostId } from '../validators/comment.js';

const router = express.Router();

// Create comment (auth required)
router.post('/:postId/comments', authMiddleware, validatePostId, validateComment, async (req, res) => {
  try {
    const comment = await Comment.create({
      body:    req.body.body,
      post_id: req.params.postId,
      user_id: req.user.id,  // vient du JWT
    });

    // Recharger avec l'auteur
    const fullComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });

    res.status(201).json(fullComment);
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(404).json({ error: 'Post not found' });
    }
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get all comments for a post (public)
router.get('/:postId/comments', validatePostId, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { post_id: req.params.postId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username'],
      }],
      order: [['created_at', 'ASC']],
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Delete comment (auth required + ownership)
router.delete('/:id', authMiddleware, validateCommentId, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: `Comment with ID ${req.params.id} not found` });
    }

    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: you can only delete your own comments' });
    }

    await comment.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;