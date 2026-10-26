const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment,
  getPopularTags,
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');

// Popular tags
router.get('/tags/popular', getPopularTags);

// Base posts routes
router
  .route('/')
  .get(optionalAuth, getPosts)
  .post(protect, createPost);

// Single post operations
router
  .route('/:identifier')
  .get(optionalAuth, getPostByIdOrSlug)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Like toggle
router.post('/:id/like', protect, toggleLikePost);

// Comments
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
