import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService, authService } from '../services/api';
import { formatDate } from '../utils/formatters';
import {
  User,
  BookOpen,
  Calendar,
  Edit,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Heart,
  MessageSquare,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'edit-profile'
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Edit profile form state
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    setLoadingPosts(true);
    try {
      const userId = user?.id || user?._id;
      const res = await postService.getPosts({ author: userId, limit: 50 });
      if (res.success) {
        setUserPosts(res.posts);
      }
    } catch (err) {
      console.error('Failed to load user posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;

    try {
      const res = await postService.deletePost(postId);
      if (res.success) {
        setUserPosts(userPosts.filter((p) => p._id !== postId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const data = await authService.updateProfile(profileData);
      if (data.success && data.user) {
        updateUser(data.user);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const totalLikes = userPosts.reduce((acc, p) => acc + (p.likesCount || 0), 0);
  const totalComments = userPosts.reduce((acc, p) => acc + (p.commentsCount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'User'}`
            }
            alt={user?.username}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user?.username}
                </h1>
                <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2 pt-2 sm:pt-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <BookOpen className="w-3.5 h-3.5" />
                  {userPosts.length} Articles
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                  <Heart className="w-3.5 h-3.5" />
                  {totalLikes} Likes
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl">
              {user?.bio || 'No bio added yet. Click on "Edit Profile" tab to add one!'}
            </p>

            <div className="mt-4 flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 border-t border-slate-100 mt-8 pt-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'posts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Articles ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('edit-profile')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'edit-profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tab 1: Articles list */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Published Articles</h2>
            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Write New Post
            </Link>
          </div>

          {loadingPosts ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-3">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-20 h-16 rounded-xl object-cover shrink-0 hidden sm:block bg-slate-100"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/post/${post.slug || post._id}`}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Link
                      to={`/edit/${post._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No articles published yet</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                Share your first technical article or story with the developer world!
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Edit Profile */}
      {activeTab === 'edit-profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Edit Profile Settings</h2>

          {profileSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Leave blank to automatically use your generated initials avatar.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bio / Tagline
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Software architect, React specialist, cloud engineering lead..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-colors mt-2"
            >
              <Save className="w-3.5 h-3.5" />
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
