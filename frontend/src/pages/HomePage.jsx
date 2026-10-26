import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Database', 'DevOps', 'Career'];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalPosts: 0,
    totalPages: 1,
  });

  const currentCategory = searchParams.get('category') || 'All';
  const currentTag = searchParams.get('tag') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Fetch posts when query params change
  useEffect(() => {
    fetchPosts();
  }, [currentCategory, currentTag, currentSearch, currentSort, currentPage]);

  // Fetch popular tags once
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await postService.getPopularTags();
        if (data.success) {
          setPopularTags(data.tags);
        }
      } catch (err) {
        console.error('Failed to fetch tags:', err.message);
      }
    };
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 6,
        sort: currentSort,
      };

      if (currentCategory && currentCategory !== 'All') {
        params.category = currentCategory;
      }
      if (currentTag) {
        params.tag = currentTag;
      }
      if (currentSearch) {
        params.search = currentSearch;
      }

      const res = await postService.getPosts(params);
      if (res.success) {
        setPosts(res.posts);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleTagClick = (tag) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentTag === tag) {
      newParams.delete('tag');
    } else {
      newParams.set('tag', tag);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sortVal) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortVal);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory !== 'All' || currentTag || currentSearch;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-slate-50 to-white py-16 sm:py-24 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Discover Knowledge & Engineering Perspectives</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Where ideas turn into <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              engineering excellence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Read in-depth technical blogs, architectural walkthroughs, and developer experiences written by software builders and designers worldwide.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search posts by title, summary, or keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Popular Tag Pills */}
          {popularTags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium mr-1 text-slate-400">Trending:</span>
              {popularTags.slice(0, 5).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTagClick(t)}
                  className={`px-2.5 py-1 rounded-full border transition-all ${
                    currentTag === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white/80 text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  (cat === 'All' && !searchParams.get('category')) || currentCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector & Filter summary */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => handleSortChange('newest')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                  currentSort === 'newest' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Newest
              </button>
              <button
                onClick={() => handleSortChange('popular')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                  currentSort === 'popular' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Popular
              </button>
            </div>
          </div>
        </div>

        {/* Filter Indicator */}
        {hasActiveFilters && (
          <div className="py-3 flex items-center gap-2 text-xs text-slate-500">
            <span>Filtering by:</span>
            {currentCategory !== 'All' && (
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Category: {currentCategory}
              </span>
            )}
            {currentTag && (
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Tag: #{currentTag}
              </span>
            )}
            {currentSearch && (
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Search: "{currentSearch}"
              </span>
            )}
          </div>
        )}

        {/* Articles Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse"
                >
                  <div className="aspect-[16/9] bg-slate-200 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-8 bg-slate-100 rounded-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No articles found</h3>
              <p className="text-sm text-slate-500 mb-6">
                We couldn't find any articles matching your search criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 text-xs font-semibold rounded-xl transition-all ${
                    pagination.page === pageNum
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
