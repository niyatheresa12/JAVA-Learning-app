import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LevelsMapPage from './pages/LevelsMapPage';
import SublevelQuizPage from './pages/SublevelQuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ThreatLairPage from './pages/ThreatLairPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-pastel-mesh text-gray-800 font-sans selection:bg-purple-300 selection:text-purple-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LevelsMapPage />} />
              <Route path="/levels" element={<LevelsMapPage />} />
              <Route path="/sublevel/:id" element={<SublevelQuizPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/threats" element={<ThreatLairPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
