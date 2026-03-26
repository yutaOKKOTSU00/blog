import { body, param, validationResult } from 'express-validator';

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
      status: 'Unprocessable Entity'
    });
  }
  next();
};

const validateComment = [
  body('body')
    .isString().withMessage('Comment body must be a string')
    .trim()
    .isLength({ min: 1 }).withMessage('Comment body cannot be empty'),
  validateResults,
];

const validateCommentId = [
  param('id')
    .isUUID(4)
    .withMessage('Comment ID must be a valid UUID'),
  validateResults
];

const validatePostId = [
  param('postId')
    .isUUID(4)
    .withMessage('Post ID must be a valid UUID'),
  validateResults
];

export { validateComment, validateCommentId, validatePostId };