import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_DB_PATH = path.join(process.cwd(), 'data', 'db.json');

async function ensureDbFile(dbPath) {
  const dir = path.dirname(dbPath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  if (!existsSync(dbPath)) {
    await writeFile(dbPath, JSON.stringify({ items: [], nextId: 1 }, null, 2), 'utf-8');
  }
}

async function loadDb(dbPath = DEFAULT_DB_PATH) {
  await ensureDbFile(dbPath);
  const raw = await readFile(dbPath, 'utf-8');
  return JSON.parse(raw);
}

async function saveDb(db, dbPath = DEFAULT_DB_PATH) {
  await writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export async function createItem(fields, dbPath = DEFAULT_DB_PATH) {
  const db = await loadDb(dbPath);
  const item = { id: db.nextId, ...fields };
  db.items.push(item);
  db.nextId += 1;
  await saveDb(db, dbPath);
  return item;
}

export async function readAll(dbPath = DEFAULT_DB_PATH) {
  const db = await loadDb(dbPath);
  return db.items;
}

export async function readById(id, dbPath = DEFAULT_DB_PATH) {
  const db = await loadDb(dbPath);
  return db.items.find((item) => item.id === Number(id)) ?? null;
}

export async function searchByField(key, value, dbPath = DEFAULT_DB_PATH) {
  const db = await loadDb(dbPath);
  return db.items.filter((item) => String(item[key]) === String(value));
}

export async function updateItem(id, updates, dbPath = DEFAULT_DB_PATH) {
  const db = await loadDb(dbPath);
  const index = db.items.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return null;
  }
  db.items[index] = { ...db.items[index], ...updates, id: db.items[index].id };
  await saveDb(db, dbPath);
  return db.items[index];
}

export async function deleteItem(id, dbPath = DEFAULT_DB_PATH) {
  const db = await loadDb(dbPath);
  const index = db.items.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return false;
  }
  db.items.splice(index, 1);
  await saveDb(db, dbPath);
  return true;
}

export { DEFAULT_DB_PATH };
