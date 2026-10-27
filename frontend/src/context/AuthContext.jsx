import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, threatService } from '../services/api';
import { sounds } from '../utils/soundEffects';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('javapuff_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('javapuff_token') || null);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Validate token with backend on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('javapuff_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('javapuff_user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.warn('Session verification failed, logging out:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success && data.token) {
      localStorage.setItem('javapuff_token', data.token);
      localStorage.setItem('javapuff_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      sounds.playVictory();
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.success && data.token) {
      localStorage.setItem('javapuff_token', data.token);
      localStorage.setItem('javapuff_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      sounds.playVictory();
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('javapuff_token');
    localStorage.removeItem('javapuff_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('javapuff_user', JSON.stringify(next));
      return next;
    });
  };

  const toggleSound = () => {
    const enabled = sounds.toggleSound();
    setSoundEnabled(enabled);
  };

  const refillHearts = async () => {
    try {
      const res = await threatService.refillHearts();
      if (res.success) {
        updateUser({ hearts: 5 });
        sounds.playCorrect();
      }
      return res;
    } catch (e) {
      console.error('Error refilling hearts:', e);
    }
  };

  const decrementHeart = async () => {
    try {
      const res = await threatService.decrementHeart();
      if (res && res.success) {
        updateUser({ hearts: res.hearts, threat_level: res.threat_level });
        return res.hearts;
      }
    } catch (e) {
      console.error('Error decrementing heart on server:', e);
    }
    // Fallback local decrement
    let fallbackHearts = 5;
    setUser((prev) => {
      if (!prev) return prev;
      fallbackHearts = Math.max(0, (prev.hearts ?? 5) - 1);
      const next = { ...prev, hearts: fallbackHearts };
      localStorage.setItem('javapuff_user', JSON.stringify(next));
      return next;
    });
    return fallbackHearts;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        soundEnabled,
        toggleSound,
        refillHearts,
        decrementHeart,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
