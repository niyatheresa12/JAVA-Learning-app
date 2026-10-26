import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import RichContentRenderer from '../components/RichContentRenderer';
import {
  PenSquare,
  Eye,
  Image,
  Tag,
  Folder,
  Send,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const CATEGORIES = ['Engineering', 'Design', 'Database', 'DevOps', 'Career', 'General'];

const COVER_PRESETS = [
  {
    name: 'Code & Laptop',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Workspace Minimal',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Server & Cloud',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Creative Design',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
];

const CreatePostPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    coverImage: COVER_PRESETS[0].url,
    summary: '',
    tags: 'React, WebDev, JavaScript',
    content: '',
  });

  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide an article title');
      return;
    }

    if (!formData.content.trim()) {
      setError('Article content cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      const res = await postService.createPost({
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });

      if (res.success && res.post) {
        navigate(`/post/${res.post.slug || res.post._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PenSquare className="w-7 h-7 text-indigo-600" />
            Create New Article
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Write down your knowledge and share it with developers around the globe.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Building Scalable Web APIs with Node.js and MongoDB"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="React, Backend, Tutorial"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Summary / Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Summary / Excerpt (Optional)
            </label>
            <input
              type="text"
              name="summary"
              placeholder="Short 1-2 sentence preview to display in post cards..."
              value={formData.summary}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-slate-400" />
            Cover Image
          </label>

          <input
            type="url"
            name="coverImage"
            placeholder="Paste an image URL..."
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Quick preset selector */}
          <div>
            <span className="text-xs text-slate-400 mb-2 block font-medium">Or choose from curated covers:</span>
            <div className="flex flex-wrap gap-2">
              {COVER_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    formData.coverImage === preset.url
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image preview */}
          {formData.coverImage && (
            <div className="aspect-[21/9] max-h-48 rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-50">
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = COVER_PRESETS[0].url;
                }}
              />
            </div>
          )}
        </div>

        {/* Content with Write / Preview Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'write'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <PenSquare className="w-3.5 h-3.5" />
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
            </div>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Supports Markdown (## Headings, **bold**, `code`, etc.)
            </span>
          </div>

          {activeTab === 'write' ? (
            <textarea
              name="content"
              rows={14}
              placeholder="Write your article content here in Markdown...
              
## Introduction
Start with a compelling premise...

### Key Concepts
- Concept 1
- Concept 2

```js
console.log('Hello world!');
```"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-slate-200 font-mono text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"
            />
          ) : (
            <div className="min-h-[300px] p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              {formData.content.trim() ? (
                <RichContentRenderer content={formData.content} />
              ) : (
                <p className="text-slate-400 italic text-sm text-center py-12">
                  Nothing to preview yet. Switch back to Write mode to type some content.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100 disabled:opacity-50 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Publishing Article...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
