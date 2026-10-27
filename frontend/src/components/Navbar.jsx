import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/soundEffects';
import { 
  Flame, 
  Heart, 
  Award, 
  Volume2, 
  VolumeX, 
  LogOut, 
  BookOpen, 
  Trophy, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, soundEnabled, toggleSound, refillHearts } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [refillModal, setRefillModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sounds.playClick();
    logout();
    navigate('/login');
  };

  const handleRefill = async () => {
    await refillHearts();
    setRefillModal(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Brand Logo */}
            <Link 
              to="/" 
              onClick={() => sounds.playClick()}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-xl text-white shadow-sm transition-transform group-hover:scale-105">
                ☕
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-gray-900">
                  Java<span className="text-purple-600">Puff</span>
                </span>
                <span className="text-[11px] font-semibold text-gray-400 -mt-0.5">
                  Interactive Java
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                to="/curriculum"
                onClick={() => sounds.playClick()}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/curriculum') || isActive('/levels')
                    ? 'bg-purple-100/70 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>Curriculum</span>
              </Link>

              <Link
                to="/leaderboard"
                onClick={() => sounds.playClick()}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/leaderboard')
                    ? 'bg-purple-100/70 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Leaderboard</span>
              </Link>

              <Link
                to="/threats"
                onClick={() => sounds.playClick()}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/threats')
                    ? 'bg-purple-100/70 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Daily Streak & Mascot</span>
              </Link>
            </nav>

            {/* User State & Actions */}
            <div className="flex items-center gap-2.5">
              {/* Sound Toggle */}
              <button
                onClick={() => {
                  toggleSound();
                  sounds.playClick();
                }}
                title={soundEnabled ? 'Mute audio' : 'Enable audio'}
                className="p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </button>

              {isAuthenticated && user ? (
                <>
                  {/* Hearts */}
                  <button
                    onClick={() => setRefillModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 hover:bg-rose-100/70 transition-colors text-xs font-black text-rose-600"
                    title="Hearts remaining. Click to refill."
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>{user.hearts ?? 5}</span>
                  </button>

                  {/* Streak */}
                  <Link
                    to="/threats"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 hover:bg-amber-100/70 transition-colors text-xs font-black text-amber-700"
                    title="Consecutive daily streak"
                  >
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{user.streak ?? 1}d</span>
                  </Link>

                  {/* Marks */}
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80 text-xs font-black text-purple-700">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>{user.marks ?? 0} pts</span>
                  </div>

                  {/* User Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border border-gray-200 hover:border-purple-300 bg-white transition-all text-xs font-bold text-gray-800"
                    >
                      <span className="text-base">{user.avatar || '☕'}</span>
                      <span className="hidden sm:inline max-w-[85px] truncate">{user.username}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {profileOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 z-50 text-xs animate-in fade-in slide-in-from-top-1"
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <div className="pb-2.5 border-b border-gray-100 mb-2">
                          <p className="font-extrabold text-gray-900 text-sm">{user.username}</p>
                          <p className="text-gray-500">{user.email}</p>
                          <span className="inline-block mt-1 font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                            {user.rankTitle || 'Syntax Sprout'}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-gray-600 py-1">
                          <div className="flex justify-between">
                            <span>Total Marks:</span>
                            <span className="font-bold text-gray-900">{user.marks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Threat Level:</span>
                            <span className="font-bold text-rose-600">Level {user.threat_level || 1}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 mt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 w-full p-2 text-rose-600 hover:bg-rose-50 rounded-lg font-bold"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={() => sounds.playClick()}
                    className="px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:text-purple-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => sounds.playClick()}
                    className="candy-btn candy-btn-purple px-4 py-2 text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Heart Refill Modal */}
      {refillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="pastel-card max-w-sm w-full p-6 text-center shadow-xl animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center text-2xl mb-3 border border-rose-200">
              💖
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">Refill Practice Hearts</h3>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Restore your hearts back to 5 so you can continue learning without interruptions.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setRefillModal(false)}
                className="candy-btn candy-btn-white flex-1 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleRefill}
                className="candy-btn candy-btn-pink flex-1 py-2 text-xs"
              >
                Refill to 5 ❤️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
