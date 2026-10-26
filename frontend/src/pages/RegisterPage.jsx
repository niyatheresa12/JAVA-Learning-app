import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/soundEffects';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const AVATAR_OPTIONS = ['☕', '🐱', '🐹', '🦊', '🐼', '🐰', '👑', '⚡'];

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('☕');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      sounds.playWrong();
      return;
    }

    setLoading(true);
    sounds.playClick();

    try {
      await register({
        username,
        email,
        password,
        avatar: selectedAvatar,
      });
      navigate('/');
    } catch (err) {
      sounds.playWrong();
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4 bg-pastel-mesh">
      <div className="max-w-sm w-full animate-in fade-in duration-200">
        <div className="pastel-card p-6 sm:p-7 border border-purple-200/90 bg-white shadow-lg">
          <div className="text-center mb-5">
            <div className="w-14 h-14 mx-auto rounded-2xl overflow-hidden border border-purple-100 shadow-xs mb-2.5 p-0.5 bg-white">
              <img
                src="/mascots/happy.jpg"
                alt="JavaPuff"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Start your Java learning journey
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Avatar Select */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Choose Avatar
              </label>
              <div className="flex justify-between gap-1 p-1.5 rounded-xl bg-gray-50 border border-gray-200">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedAvatar(emoji);
                    }}
                    className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                      selectedAvatar === emoji
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. JavaDev"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none bg-gray-50/50 text-gray-800 text-xs font-medium"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none bg-gray-50/50 text-gray-800 text-xs font-medium"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none bg-gray-50/50 text-gray-800 text-xs font-medium"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full candy-btn candy-btn-purple py-2.5 text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{loading ? 'Registering...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-5">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                onClick={() => sounds.playClick()}
                className="font-bold text-purple-600 hover:text-purple-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
