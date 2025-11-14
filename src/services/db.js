import { openDB } from 'idb';

const DB_NAME = 'todoDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('urgent', 'urgent');
        store.createIndex('important', 'important');
        store.createIndex('reminderDate', 'reminderDate');
        store.createIndex('completed', 'completed');
        store.createIndex('createdAt', 'createdAt');
      }
    },
  });
};

export const addTask = async (task) => {
  const db = await initDB();
  const newTask = {
    ...task,
    createdAt: Date.now(),
    completed: false,
  };
  return db.add(STORE_NAME, newTask);
};

export const getAllTasks = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const getTask = async (id) => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

export const updateTask = async (id, updates) => {
  const db = await initDB();
  const task = await db.get(STORE_NAME, id);
  if (!task) return null;

  const updatedTask = { ...task, ...updates };
  await db.put(STORE_NAME, updatedTask);
  return updatedTask;
};

export const deleteTask = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

export const getTasksByCategory = async (urgent, important) => {
  const db = await initDB();
  const allTasks = await db.getAll(STORE_NAME);
  return allTasks.filter(
    task => task.urgent === urgent && task.important === important && !task.completed
  );
};

export const getTasksWithReminders = async () => {
  const db = await initDB();
  const allTasks = await db.getAll(STORE_NAME);
  const now = Date.now();
  return allTasks.filter(
    task => task.reminderDate && task.reminderDate <= now && !task.completed
  );
};

export const toggleTaskComplete = async (id) => {
  const db = await initDB();
  const task = await db.get(STORE_NAME, id);
  if (!task) return null;

  task.completed = !task.completed;
  task.completedAt = task.completed ? Date.now() : null;
  await db.put(STORE_NAME, task);
  return task;
};
