import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white/80 border-t border-purple-100/80 py-6 px-4 text-center mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">JavaPuff</span>
          <span className="text-gray-300">|</span>
          <span>Interactive Java Learning Platform</span>
        </div>

        <nav className="flex items-center gap-4 text-xs font-semibold">
          <Link to="/" className="hover:text-purple-600 transition-colors">Curriculum</Link>
          <Link to="/leaderboard" className="hover:text-purple-600 transition-colors">Leaderboard</Link>
          <Link to="/threats" className="hover:text-purple-600 transition-colors">Mascot Status</Link>
        </nav>

        <div className="text-gray-400 text-[11px]">
          © {new Date().getFullYear()} JavaPuff.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
