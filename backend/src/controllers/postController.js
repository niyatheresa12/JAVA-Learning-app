const mongoose = require('mongoose');
const Post = require('../models/Post');

// @desc    Get all posts (with filtering, search & pagination)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const { search, tag, category, author, sort } = req.query;

    let filter = {};

    // Keyword search across title, summary, and tags
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Filter by tag
    if (tag) {
      filter.tags = { $in: [new RegExp(`^${tag.trim()}$`, 'i')] };
    }

    // Filter by category
    if (category) {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Filter by author ID
    if (author) {
      if (mongoose.Types.ObjectId.isValid(author)) {
        filter.author = author;
      }
    }

    // Determine sort
    let sortCriteria = { createdAt: -1 };
    if (sort === 'oldest') {
      sortCriteria = { createdAt: 1 };
    } else if (sort === 'popular') {
      // Sort by likes count
      sortCriteria = { 'likes.length': -1, createdAt: -1 };
    }

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find(filter)
      .populate('author', 'username avatar bio')
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    // Map posts to format like counts and liked status if user is logged in
    const currentUserId = req.user ? req.user._id.toString() : null;
    const formattedPosts = posts.map((post) => ({
      ...post,
      likesCount: post.likes ? post.likes.length : 0,
      commentsCount: post.comments ? post.comments.length : 0,
      isLiked: currentUserId
        ? post.likes.some((id) => id.toString() === currentUserId)
        : false,
    }));

    res.status(200).json({
      success: true,
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID or Slug
// @route   GET /api/posts/:identifier
// @access  Public
const getPostByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }

    const post = await Post.findOne(query)
      .populate('author', 'username avatar bio createdAt')
      .populate('comments.user', 'username avatar')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;

    res.status(200).json({
      success: true,
      post: {
        ...post,
        likesCount: post.likes ? post.likes.length : 0,
        commentsCount: post.comments ? post.comments.length : 0,
        isLiked: currentUserId
          ? post.likes.some((id) => id.toString() === currentUserId)
          : false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, summary, content, coverImage, tags, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the post',
      });
    }

    // Process tags: handle comma separated string or array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const post = new Post({
      title,
      summary,
      content,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      tags: processedTags,
      category: category || 'General',
      author: req.user._id,
    });

    const savedPost = await post.save();
    await savedPost.populate('author', 'username avatar bio');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: savedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, summary, content, coverImage, tags, category } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post',
      });
    }

    if (title) post.title = title;
    if (summary !== undefined) post.summary = summary;
    if (content) post.content = content;
    if (coverImage) post.coverImage = coverImage;
    if (category) post.category = category;

    if (tags !== undefined) {
      let processedTags = [];
      if (Array.isArray(tags)) {
        processedTags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        processedTags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
      post.tags = processedTags;
    }

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'username avatar bio');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like / unlike on a post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const hasLiked = post.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      isLiked: !hasLiked,
      likesCount: post.likes.length,
      message: hasLiked ? 'Post unliked' : 'Post liked',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate comments user
    await post.populate('comments.user', 'username avatar');

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added',
      comment: addedComment,
      comments: post.comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from a post
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Only comment creator, post creator, or admin can delete
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment removed successfully',
      comments: post.comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct tags with count
// @route   GET /api/posts/tags/popular
// @access  Public
const getPopularTags = async (req, res, next) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]);

    res.status(200).json({
      success: true,
      tags: tags.map((t) => t.tag),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment,
  getPopularTags,
};
