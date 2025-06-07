/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { initDatabase, getDatabase, closeDatabase } = require("./db");

let mainWindow;
let db = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../.next/index.html")}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();

  // Initialize the database
  try {
    db = initDatabase();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  // Close the database connection
  closeDatabase();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Set up IPC handlers for database operations
ipcMain.handle("database:getAll", async (_, table) => {
  try {
    if (!db) db = getDatabase();
    return db.prepare(`SELECT * FROM ${table}`).all();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle("database:getById", async (_, table, id) => {
  try {
    if (!db) db = getDatabase();
    return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle("database:insert", async (_, table, data) => {
  try {
    if (!db) db = getDatabase();

    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const values = Object.values(data);

    const result = db
      .prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`)
      .run(...values);

    return { id: result.lastInsertRowid };
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle("database:update", async (_, table, id, data) => {
  try {
    if (!db) db = getDatabase();

    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(data), id];

    const result = db
      .prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`)
      .run(...values);

    return { changes: result.changes };
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle("database:delete", async (_, table, id) => {
  try {
    if (!db) db = getDatabase();

    const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);

    return { changes: result.changes };
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle("database:query", async (_, query, params = []) => {
  try {
    if (!db) db = getDatabase();

    if (query.trim().toLowerCase().startsWith("select")) {
      return db.prepare(query).all(...params);
    } else {
      return db.prepare(query).run(...params);
    }
  } catch (error) {
    return { error: error.message };
  }
});
