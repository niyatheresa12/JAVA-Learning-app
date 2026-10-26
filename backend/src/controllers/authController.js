const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlDb = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Calculate rank title from marks
const getRankTitle = (marks) => {
  if (marks >= 1500) return '👑 JVM Overlord';
  if (marks >= 1000) return '💎 Byte Archmage';
  if (marks >= 600) return '⚡ Thread Master';
  if (marks >= 300) return '🌸 OOP Artisan';
  if (marks >= 100) return '🌱 Syntax Sprout';
  return '☕ Coffee Bean Baby';
};

// Register new student
exports.register = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const existing = sqlDb.get('SELECT id FROM users WHERE email = ? OR username = ?', [email.toLowerCase(), username]);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student with that email or username already exists!'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default avatar if none provided
    const userAvatar = avatar || '☕';

    // Insert user into SQLite
    const result = sqlDb.run(
      `INSERT INTO users (username, email, password_hash, avatar, marks, xp, streak, hearts, threat_level, last_active_date)
       VALUES (?, ?, ?, ?, 0, 0, 1, 5, 1, DATE('now'))`,
      [username, email.toLowerCase(), passwordHash, userAvatar]
    );

    const userId = Number(result.lastInsertRowid);
    const token = generateToken(userId);

    const newUser = sqlDb.get(
      'SELECT id, username, email, avatar, marks, xp, streak, hearts, threat_level, created_at FROM users WHERE id = ?',
      [userId]
    );

    newUser.rankTitle = getRankTitle(newUser.marks);

    res.status(201).json({
      success: true,
      token,
      user: newUser,
      message: 'Account created! Welcome to JavaPuff. Koffi will be monitoring your daily progress!'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};

// Login student
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/username and password.'
      });
    }

    const user = sqlDb.get(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier.toLowerCase(), identifier]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Koffi says: Did you forget your login?'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Koffi is watching you fail your login!'
      });
    }

    // Streak calculation based on last_active_date
    const today = new Date().toISOString().slice(0, 10);
    let newStreak = user.streak;
    let newThreat = user.threat_level;

    if (user.last_active_date) {
      const lastDate = new Date(user.last_active_date);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
        newThreat = Math.max(1, newThreat - 1); // Rewarded for daily comeback
      } else if (diffDays > 1) {
        newStreak = 1; // Streak reset!
        newThreat = 3; // Threat level increased because of absence!
      }
    }

    // Update last_active_date, streak, threat_level
    sqlDb.run(
      'UPDATE users SET streak = ?, threat_level = ?, last_active_date = DATE(\'now\') WHERE id = ?',
      [newStreak, newThreat, user.id]
    );

    const token = generateToken(user.id);

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      marks: user.marks,
      xp: user.xp,
      streak: newStreak,
      hearts: user.hearts,
      threat_level: newThreat,
      rankTitle: getRankTitle(user.marks),
      created_at: user.created_at
    };

    res.status(200).json({
      success: true,
      token,
      user: safeUser,
      message: 'Login successful! Time to crush your Java questions!'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = sqlDb.get(
      `SELECT u.id, u.username, u.email, u.avatar, u.marks, u.xp, u.streak, u.hearts, u.threat_level, u.created_at,
              (SELECT COUNT(*) FROM user_progress WHERE user_id = u.id AND completed = 1) as completed_sublevels,
              (SELECT COALESCE(SUM(stars), 0) FROM user_progress WHERE user_id = u.id) as total_stars
       FROM users u WHERE u.id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.rankTitle = getRankTitle(user.marks);

    // Calculate user's global leaderboard position
    const leaderPos = sqlDb.get(
      'SELECT COUNT(*) + 1 as rank FROM users WHERE marks > ?',
      [user.marks]
    ).rank;

    user.leaderboardRank = leaderPos;

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving profile' });
  }
};

// Update user avatar
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ success: false, message: 'Avatar is required' });
    }

    sqlDb.run('UPDATE users SET avatar = ? WHERE id = ?', [avatar, req.user.id]);
    res.status(200).json({ success: true, message: 'Avatar updated!', avatar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating avatar' });
  }
};
