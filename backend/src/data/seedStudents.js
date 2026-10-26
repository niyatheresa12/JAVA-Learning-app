const sqlDb = require('../config/db');
const bcrypt = require('bcryptjs');

const sampleStudents = [
  { username: 'ByteBarista', email: 'barista@javapuff.dev', marks: 1850, xp: 18500, streak: 14, avatar: '☕', threat: 1 },
  { username: 'SyntaxQueen', email: 'queen@javapuff.dev', marks: 1420, xp: 14200, streak: 9, avatar: '👑', threat: 1 },
  { username: 'DukeTheHamster', email: 'duke@javapuff.dev', marks: 980, xp: 9800, streak: 5, avatar: '🐹', threat: 2 },
  { username: 'GarbageCollectorCat', email: 'cat@javapuff.dev', marks: 650, xp: 6500, streak: 3, avatar: '🐱', threat: 3 },
  { username: 'NullPointerNinja', email: 'ninja@javapuff.dev', marks: 320, xp: 3200, streak: 1, avatar: '🦊', threat: 4 },
  { username: 'ProcrastinatingPanda', email: 'panda@javapuff.dev', marks: 50, xp: 500, streak: 0, avatar: '🐼', threat: 4 }
];

async function seedStudents() {
  const count = sqlDb.get('SELECT COUNT(*) as c FROM users').c;
  if (count >= 5) {
    console.log('[Seed] Sample students already present.');
    return;
  }

  console.log('[Seed] Seeding sample students for leaderboard...');
  const defaultPassword = 'password123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  for (const s of sampleStudents) {
    const existing = sqlDb.get('SELECT id FROM users WHERE email = ?', [s.email]);
    if (!existing) {
      sqlDb.run(
        `INSERT INTO users (username, email, password_hash, avatar, marks, xp, streak, hearts, threat_level)
         VALUES (?, ?, ?, ?, ?, ?, ?, 5, ?)`,
        [s.username, s.email, passwordHash, s.avatar, s.marks, s.xp, s.streak, s.threat]
      );
    }
  }

  console.log('[Seed] Sample students seeded successfully.');
}

module.exports = { seedStudents };
