import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/soundEffects';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    sounds.playClick();

    try {
      await login({ identifier, password });
      navigate('/');
    } catch (err) {
      sounds.playWrong();
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (username) => {
    setError(null);
    setLoading(true);
    sounds.playClick();
    try {
      await login({ identifier: username, password: 'password123' });
      navigate('/');
    } catch (err) {
      sounds.playWrong();
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4 bg-pastel-mesh">
      <div className="max-w-sm w-full animate-in fade-in duration-200">
        <div className="pastel-card p-6 sm:p-7 border border-purple-200/90 bg-white shadow-lg">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-14 h-14 mx-auto rounded-2xl overflow-hidden border border-purple-100 shadow-xs mb-2.5 p-0.5 bg-white">
              <img
                src="/mascots/menacing.jpg"
                alt="JavaPuff"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Continue your daily Java practice
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. ByteBarista"
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
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 block text-center mb-2">
              Demo Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ByteBarista')}
                className="candy-btn candy-btn-white py-1.5 text-xs font-bold text-purple-700 border-purple-200"
              >
                ☕ ByteBarista
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('SyntaxQueen')}
                className="candy-btn candy-btn-white py-1.5 text-xs font-bold text-pink-700 border-pink-200"
              >
                👑 SyntaxQueen
              </button>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-xs text-gray-500">
              New here?{' '}
              <Link
                to="/register"
                onClick={() => sounds.playClick()}
                className="font-bold text-purple-600 hover:text-purple-800"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
