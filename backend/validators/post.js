import { body, query, param, validationResult } from 'express-validator';

// Middleware to validate results
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
// Validate post creation/update
const validatePost = [
  body('title')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .isString().withMessage('Content must be a string')
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('published')
    .optional()
    .isBoolean().withMessage('Published must be a boolean'),
  validateResults,
];
// Validate query parameters
const validatePostQuery = [
  query('published')
    .optional()
    .isBoolean()
    .withMessage('Published query parameter must be a boolean')
    .toBoolean(),
  validateResults
];

// Validate post ID parameter
const validatePostId = [
  param('id')
    .isUUID(4)
    .withMessage('Post ID must be a valid UUID'),
  validateResults
];

const validatePostUpdate = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published flag must be a boolean'),
  validateResults
];

export { validatePost, validatePostUpdate, validatePostQuery, validatePostId };