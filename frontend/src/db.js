import { openDB } from 'idb';

const dbName = 'focusTimerDB';
const dbVersion = 1;

export async function initDB() {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('sessions', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('by-date', 'start_time');
    },
  });
  return db;
}

export async function saveSession(session) {
  const db = await initDB();
  return db.add('sessions', session);
}

export async function getSessions() {
  const db = await initDB();
  return db.getAllFromIndex('sessions', 'by-date');
}