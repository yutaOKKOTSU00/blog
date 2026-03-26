import express from 'express';
import { Comment, User } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateComment, validateCommentId, validatePostId } from '../validators/comment.js';

const router = express.Router();

// Create a comment on a post (auth required)
router.post('/:postId/comments', authMiddleware, validatePostId, validateComment, async (req, res) => {
  try {
    const comment = await Comment.create({
      body: req.body.body,
      post_id: req.params.postId,
      user_id: req.user.id
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(404).json({ error: 'Post or user not found' });
    }
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get all comments for a post
router.get('/:postId/comments', validatePostId, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { post_id: req.params.postId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username'] // only expose what the frontend needs
      }],
      order: [['created_at', 'ASC']]
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Delete a comment
router.delete('/:id', validateCommentId, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: `Comment with ID ${req.params.id} not found` });
    }

    await comment.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;