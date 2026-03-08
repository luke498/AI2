const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'draftmate.db');
const schemaPath = path.join(__dirname, 'schema.sql');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}



async function runSafeMigration(sql) {
  try {
    await run(sql);
  } catch (error) {
    const message = String(error && error.message ? error.message : error);
    if (!message.includes('duplicate column name')) {
      throw error;
    }
  }
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

  await new Promise((resolve, reject) => {
    db.exec(schemaSQL, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

  await runSafeMigration('ALTER TABLE requests ADD COLUMN edited_draft TEXT');
  await runSafeMigration('ALTER TABLE requests ADD COLUMN generated_at DATETIME DEFAULT CURRENT_TIMESTAMP');
  await runSafeMigration('ALTER TABLE requests ADD COLUMN saved_at DATETIME');
}


module.exports = {
  db,
  run,
  get,
  all,
  initializeDatabase,
};
