import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.join(__dirname, "..");

function resolveDbPath() {
  const rawPath = process.env.DB_PATH;
  if (!rawPath) {
    return path.join(baseDir, "data.db");
  }
  if (path.isAbsolute(rawPath)) {
    return rawPath;
  }
  return path.join(baseDir, rawPath);
}

let dbInstance;

async function ensureSchema(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pending_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photo TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      age INTEGER NOT NULL,
      city TEXT NOT NULL,
      motivation TEXT,
      transaction_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photo TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      email TEXT,
      age INTEGER NOT NULL,
      city TEXT NOT NULL,
      motivation TEXT,
      transaction_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_candidates_name
    ON candidates (first_name, last_name);
  `);
}

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: resolveDbPath(),
      driver: sqlite3.Database,
    });
  }

  await ensureSchema(dbInstance);

  return dbInstance;
}
