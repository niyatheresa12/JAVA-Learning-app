import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Clock, User, ArrowUpRight } from 'lucide-react';
import { formatDate, getCategoryColor } from '../utils/formatters';

const PostCard = ({ post }) => {
  const {
    _id,
    slug,
    title,
    summary,
    coverImage,
    category,
    tags,
    author,
    readingTime,
    likesCount = 0,
    commentsCount = 0,
    createdAt,
  } = post;

  const postIdentifier = slug || _id;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Cover Image */}
      <Link
        to={`/post/${postIdentifier}`}
        className="relative aspect-[16/9] overflow-hidden bg-slate-100 block"
      >
        <img
          src={
            coverImage ||
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
          }
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {category && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${getCategoryColor(
              category
            )}`}
          >
            {category}
          </span>
        )}
      </Link>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link to={`/post/${postIdentifier}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-snug">
              {title}
            </h3>
          </Link>

          {/* Summary */}
          {summary && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {summary}
            </p>
          )}
        </div>

        {/* Footer: Author & Meta Stats */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <img
              src={
                author?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${author?.username || 'Author'}`
              }
              alt={author?.username}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {author?.username || 'Anonymous'}
              </span>
              <span className="text-[10px] text-slate-400">
                {formatDate(createdAt)}
              </span>
            </div>
          </div>

          {/* Reading Time, Likes & Comments */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime || 1}m
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
