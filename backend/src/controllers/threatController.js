const sqlDb = require('../config/db');

const threatQuotes = {
  1: [
    "Koffi is purring like a well-optimized JVM! Keep studying daily to maintain peace in your IDE. ☕✨",
    "JVM heap space is clean, memory is deallocated, and Koffi loves your dedication!",
    "Great work today! But remember... Koffi never truly sleeps."
  ],
  2: [
    "Koffi is tapping his tiny paw on your spacebar. Did you forget to practice your Java today?",
    "Every minute you procrastinate, another unhandled NullPointerException is born. Koffi is watching. 👀",
    "Your streak is hanging by a single unclosed curly bracket. Don't test Koffi's patience!"
  ],
  3: [
    "⚠️ CODE YELLOW: Koffi has placed your semicolon key under house arrest until you complete 15 questions!",
    "Warning: Koffi is contemplating injecting an infinite while(true) loop into your alarm clock!",
    "Do you really want to break your streak? Even the Garbage Collector has more discipline than this!"
  ],
  4: [
    "🚨 DEFCON JAVA ALERT! Koffi is standing outside your door with a heavy StackOverflowError! STUDY JAVA NOW OR ELSE! 🔥",
    "Koffi's fury cannot be contained by any try-catch block! Solved 0 questions today?! LEARN JAVA IMMEDIATELY!",
    "You have entered Koffi's hit-list! If you don't answer 15 Java questions within 2 hours, Koffi will delete your dark mode theme!"
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

    // Determine current threat level (1 to 4)
    let currentThreat = user.threat_level || 1;
    if (!hasPracticedToday && currentThreat < 3) {
      currentThreat = 2; // Elevate threat if user hasn't completed lessons today
    }

    // Determine mascot mood: happy, menacing, angry
    let mood = 'happy';
    if (currentThreat >= 4) mood = 'angry';
    else if (currentThreat >= 2) mood = 'menacing';

    // Pick a sassy quote
    const quotes = threatQuotes[currentThreat] || threatQuotes[1];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    // Calculate hours remaining before midnight (streak deadline)
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const hoursLeft = Math.max(1, Math.round((midnight - now) / (1000 * 60 * 60)));

    res.status(200).json({
      success: true,
      threat_level: currentThreat,
      threat_name: currentThreat === 1 ? 'Peaceful Bean' : currentThreat === 2 ? 'Passive-Aggressive' : currentThreat === 3 ? 'Semicolon Hostage' : 'DEFCON JVM RAGE',
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
      message: 'Koffi accepted your pathetic plea for mercy... for the next 2 hours! NOW GO STUDY!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing mercy request' });
  }
};

// Refill hearts
exports.refillHearts = async (req, res) => {
  try {
    const userId = req.user.id;
    sqlDb.run('UPDATE users SET hearts = 5 WHERE id = ?', [userId]);

    res.status(200).json({
      success: true,
      hearts: 5,
      message: 'Koffi replenished your 5 pastel hearts! Do not waste them on silly syntax errors!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error refilling hearts' });
  }
};
