const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'javapuff.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for performance and integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

console.log(`[SQLite Database] Connected successfully to ${dbPath}`);

/**
 * Helper to run queries with prepared statements
 */
const sqlDb = {
  db,
  
  // Run an execute statement (CREATE TABLE, PRAGMA, etc.)
  exec(sql) {
    return db.exec(sql);
  },

  // Prepare and return all rows
  all(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  // Prepare and return single row
  get(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  },

  // Prepare and run an INSERT/UPDATE/DELETE statement
  run(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  }
};

module.exports = sqlDb;
