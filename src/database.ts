import { Database } from 'sqlite3';

const db = new Database('database.db');

const init = async () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS start (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video TEXT,
      description TEXT,
      choice_1 INTEGER DEFAULT NULL,
      choice_2 INTEGER DEFAULT NULL,
      choice_3 INTEGER DEFAULT NULL,
      choice_4 INTEGER DEFAULT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_id INTEGER,
      video TEXT,
      description TEXT,
      choice_1 INTEGER DEFAULT NULL,
      choice_2 INTEGER DEFAULT NULL,
      choice_3 INTEGER DEFAULT NULL,
      choice_4 INTEGER DEFAULT NULL
    );
  `);
};

export { db, init };
