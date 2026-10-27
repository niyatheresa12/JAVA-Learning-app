const sqlDb = require('../config/db');

const threatQuotes = {
  1: [
    "Koffi is content with your practice streak. Keep up the daily discipline! ☕",
    "No memory leaks detected today. Your JVM is clean and stable.",
    "Great work! Maintain your daily streak to prevent Koffi from getting restless."
  ],
  2: [
    "Koffi noticed you have not practiced yet today. Don't fall behind!",
    "Every skipped day risks breaking your streak. Koffi is watching your progress.",
    "Your streak is waiting for today's 15 questions. Log your daily session!"
  ],
  3: [
    "Warning: Koffi has placed your semicolon key under probation until today's practice!",
    "Only a few hours left before midnight. Keep your streak alive!",
    "Discipline matters in Java. Complete 15 questions before your streak resets."
  ],
  4: [
    "DEFCON ALERT: Streak reset is imminent! Complete a sublevel immediately!",
    "Koffi's patience has expired. Complete your 15 questions to reset threat level!",
    "Your streak is in critical danger. Practice now to restore your status!"
  ]
};

exports.getThreatStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = sqlDb.get('SELECT streak, threat_level, last_active_date, hearts, marks FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const hasPracticedToday = user.last_active_date === today;

    let currentThreat = user.threat_level || 1;
    if (!hasPracticedToday && currentThreat < 3) {
      currentThreat = 2;
    }

    let mood = 'happy';
    if (currentThreat >= 4) mood = 'angry';
    else if (currentThreat >= 2) mood = 'menacing';

    const quotes = threatQuotes[currentThreat] || threatQuotes[1];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const hoursLeft = Math.max(1, Math.round((midnight - now) / (1000 * 60 * 60)));

    res.status(200).json({
      success: true,
      threat_level: currentThreat,
      threat_name: currentThreat === 1 ? 'Peaceful' : currentThreat === 2 ? 'Warning' : currentThreat === 3 ? 'Elevated' : 'Critical',
      mood,
      has_practiced_today: hasPracticedToday,
      hours_until_streak_loss: hoursLeft,
      message: quote,
      hearts: user.hearts,
      streak: user.streak,
      marks: user.marks
    });
  } catch (error) {
    console.error('getThreatStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve threat status.' });
  }
};

// User begs for mercy to reduce anger
exports.begForMercy = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = sqlDb.get('SELECT threat_level FROM users WHERE id = ?', [userId]);

    const loweredThreat = Math.max(1, (user.threat_level || 2) - 1);
    sqlDb.run('UPDATE users SET threat_level = ? WHERE id = ?', [loweredThreat, userId]);

    res.status(200).json({
      success: true,
      threat_level: loweredThreat,
      message: 'Koffi lowered the threat level. Complete your daily session to stay safe!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing mercy request' });
  }
};

// Refill hearts to 5
exports.refillHearts = async (req, res) => {
  try {
    const userId = req.user.id;
    sqlDb.run('UPDATE users SET hearts = 5 WHERE id = ?', [userId]);

    res.status(200).json({
      success: true,
      hearts: 5,
      message: 'Hearts replenished back to 5.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error refilling hearts' });
  }
};

// Decrement 1 heart on wrong answer
exports.decrementHeart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = sqlDb.get('SELECT hearts, threat_level FROM users WHERE id = ?', [userId]);
    const currentHearts = user ? user.hearts : 5;
    const newHearts = Math.max(0, currentHearts - 1);

    let newThreat = user ? user.threat_level : 1;
    if (newHearts <= 1) {
      newThreat = Math.min(4, newThreat + 1);
    }

    sqlDb.run('UPDATE users SET hearts = ?, threat_level = ? WHERE id = ?', [newHearts, newThreat, userId]);

    res.status(200).json({
      success: true,
      hearts: newHearts,
      threat_level: newThreat,
      message: newHearts === 0 ? 'Out of hearts!' : `1 heart lost. ${newHearts} hearts remaining.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error decrementing heart' });
  }
};
