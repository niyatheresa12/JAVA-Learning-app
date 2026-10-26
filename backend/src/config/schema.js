const sqlDb = require('./db');

function initSchema() {
  console.log('[SQLite Database] Initializing tables...');

  // Users table
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT DEFAULT '☕',
      marks INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 1,
      last_active_date TEXT DEFAULT (DATE('now')),
      hearts INTEGER DEFAULT 5,
      threat_level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Levels table (Beginner, Moderate, Advanced)
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS levels (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      color_theme TEXT NOT NULL,
      order_index INTEGER NOT NULL
    );
  `);

  // Sublevels table (12 per level = 36 total)
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS sublevels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level_id TEXT NOT NULL,
      sublevel_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      min_marks_to_unlock INTEGER DEFAULT 0,
      FOREIGN KEY (level_id) REFERENCES levels(id)
    );
  `);

  // Questions table (15 per sublevel = 540 total)
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sublevel_id INTEGER NOT NULL,
      question_index INTEGER NOT NULL,
      question_type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      code_snippet TEXT,
      options_json TEXT NOT NULL,
      correct_answer_json TEXT NOT NULL,
      explanation TEXT NOT NULL,
      threat_hint TEXT,
      FOREIGN KEY (sublevel_id) REFERENCES sublevels(id)
    );
  `);

  // User Progress table
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      sublevel_id INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      best_score INTEGER DEFAULT 0,
      stars INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, sublevel_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (sublevel_id) REFERENCES sublevels(id)
    );
  `);

  // User question answers history
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS user_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      user_answer TEXT,
      is_correct INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  // Threat events / logs
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS threat_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      threat_level INTEGER NOT NULL,
      message TEXT NOT NULL,
      mood TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  console.log('[SQLite Database] Tables initialized successfully.');
}

module.exports = initSchema;
