import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RichContentRenderer from '../components/RichContentRenderer';
import { formatDate, formatRelativeTime, getCategoryColor } from '../utils/formatters';
import {
  Heart,
  MessageSquare,
  Clock,
  Calendar,
  Share2,
  Trash2,
  Edit,
  ArrowLeft,
  Send,
  AlertCircle,
  Check,
} from 'lucide-react';

const PostDetailPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment form state
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Like state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Copy share feedback
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await postService.getPost(identifier);
        if (data.success && data.post) {
          setPost(data.post);
          setIsLiked(data.post.isLiked || false);
          setLikesCount(data.post.likesCount || 0);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [identifier]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (likeLoading || !post) return;

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);
    setLikeLoading(true);

    try {
      const data = await postService.toggleLike(post._id);
      if (data.success) {
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      // Revert if error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      console.error('Like toggle failed:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setCommentSubmitting(true);
    try {
      const data = await postService.addComment(post._id, { text: commentText.trim() });
      if (data.success) {
        setPost({
          ...post,
          comments: data.comments,
          commentsCount: data.comments.length,
        });
        setCommentText('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not post comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const data = await postService.deleteComment(post._id, commentId);
      if (data.success) {
        setPost({
          ...post,
          comments: data.comments,
          commentsCount: data.comments.length,
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;

    try {
      const res = await postService.deletePost(post._id);
      if (res.success) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-24"></div>
        <div className="h-10 bg-slate-200 rounded w-3/4"></div>
        <div className="aspect-[21/9] bg-slate-200 rounded-2xl"></div>
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{error || 'Article not found'}</h2>
        <p className="text-sm text-slate-500 mb-6">
          The article you are looking for may have been removed or the link is broken.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.author?._id || user._id === post.author?._id || user.role === 'admin');

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button & Action controls */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </Link>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${post._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              onClick={handleDeletePost}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 bg-white border border-rose-200 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Category Pill */}
      {post.category && (
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${getCategoryColor(
            post.category
          )}`}
        >
          {post.category}
        </span>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-6">
        {post.title}
      </h1>

      {/* Summary */}
      {post.summary && (
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 border-l-2 border-indigo-500 pl-4 italic">
          {post.summary}
        </p>
      )}

      {/* Author and Date metadata bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 mb-8">
        <div className="flex items-center gap-3">
          <img
            src={
              post.author?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username || 'User'}`
            }
            alt={post.author?.username}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/10"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{post.author?.username}</h4>
            <p className="text-xs text-slate-500 truncate max-w-xs">{post.author?.bio || 'Author'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            {post.readingTime || 1} min read
          </span>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-10 aspect-[16/9] max-h-[480px]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Body Content */}
      <div className="text-slate-800 leading-relaxed text-base sm:text-lg mb-12">
        <RichContentRenderer content={post.content} />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag, idx) => (
            <Link
              key={idx}
              to={`/?tag=${tag}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Social / Engagement Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isLiked
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <a
            href="#comments"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>{post.comments?.length || 0} Comments</span>
          </a>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors rounded-lg"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Comments Section */}
      <section id="comments" className="pt-8 border-t border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Discussion ({post.comments?.length || 0})
        </h3>

        {/* Add Comment Box */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-10">
            <div className="flex gap-3 items-start">
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'User'}`
                }
                alt={user?.username}
                className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
              />
              <div className="flex-1 space-y-2">
                <textarea
                  rows={3}
                  placeholder="Share your thoughts or feedback on this article..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 resize-none bg-white shadow-xs"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || commentSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {commentSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center mb-8">
            <p className="text-xs text-indigo-900 mb-2 font-medium">
              Want to join the conversation? Sign in to leave a comment.
            </p>
            <Link
              to="/login"
              state={{ from: window.location.pathname }}
              className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Comment List */}
        <div className="space-y-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => {
              const canDeleteComment =
                user &&
                (user.id === comment.user?._id ||
                  user._id === comment.user?._id ||
                  user.id === post.author?._id ||
                  user._id === post.author?._id ||
                  user.role === 'admin');

              return (
                <div
                  key={comment._id}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        comment.user?.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user?.username || 'User'}`
                      }
                      alt={comment.user?.username}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {comment.user?.username || 'User'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  </div>

                  {canDeleteComment && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 italic py-4">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

export default PostDetailPage;
