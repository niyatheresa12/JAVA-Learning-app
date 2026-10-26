const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text cannot be empty'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    summary: {
      type: String,
      maxlength: [300, 'Summary cannot exceed 300 characters'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readingTime: {
      type: Number, // in minutes
      default: 1,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// Slugify title and calculate reading time
postSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.slug = `${baseSlug}-${Date.now().toString(36)}`;
  }

  if (this.isModified('content') || !this.summary) {
    // Generate summary if missing
    if (!this.summary) {
      const plainText = this.content.replace(/<[^>]+>/g, '').replace(/[#*`_~]/g, '');
      this.summary = plainText.slice(0, 160) + (plainText.length > 160 ? '...' : '');
    }

    // Estimate reading time (~200 words per minute)
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
