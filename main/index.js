/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { initDatabase, getDatabase, closeDatabase } = require("./db");

let mainWindow;
let db = null;

function createWindow() {
  console.log("[Main] Creating main window...");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../.next/index.html")}`;

  console.log("[Main] Loading URL:", startUrl);
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  console.log("[Main] App is ready, creating window...");
  createWindow();

  // Initialize the database
  try {
    db = initDatabase();
    console.log("[Main] Database initialized successfully");
  } catch (error) {
    console.error("[Main] Error initializing database:", error);
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
console.log("[Main] Setting up IPC handlers...");

ipcMain.handle("db-get-all", async (_, table) => {
  console.log("[Main] Handling db-get-all for table:", table);
  try {
    if (!db) db = getDatabase();
    return db.prepare(`SELECT * FROM ${table}`).all();
  } catch (error) {
    console.error("[Main] Error in db-get-all:", error);
    return { error: error.message };
  }
});

ipcMain.handle("db-get-by-id", async (_, table, id) => {
  console.log("[Main] Handling db-get-by-id for table:", table, "id:", id);
  try {
    if (!db) db = getDatabase();
    return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  } catch (error) {
    console.error("[Main] Error in db-get-by-id:", error);
    return { error: error.message };
  }
});

ipcMain.handle("db-insert", async (_, table, data) => {
  console.log("[Main] Handling db-insert for table:", table, "data:", data);
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
    console.error("[Main] Error in db-insert:", error);
    return { error: error.message };
  }
});

ipcMain.handle("db-update", async (_, table, id, data) => {
  console.log(
    "[Main] Handling db-update for table:",
    table,
    "id:",
    id,
    "data:",
    data
  );
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
    console.error("[Main] Error in db-update:", error);
    return { error: error.message };
  }
});

ipcMain.handle("db-delete", async (_, table, id) => {
  console.log("[Main] Handling db-delete for table:", table, "id:", id);
  try {
    if (!db) db = getDatabase();

    const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);

    return { changes: result.changes };
  } catch (error) {
    console.error("[Main] Error in db-delete:", error);
    return { error: error.message };
  }
});

ipcMain.handle("db-custom-query", async (_, query, params = []) => {
  console.log(
    "[Main] Handling db-custom-query with query:",
    query,
    "params:",
    params
  );
  try {
    if (!db) db = getDatabase();

    if (query.trim().toLowerCase().startsWith("select")) {
      return db.prepare(query).all(...params);
    } else {
      return db.prepare(query).run(...params);
    }
  } catch (error) {
    console.error("[Main] Error in db-custom-query:", error);
    return { error: error.message };
  }
});

console.log("[Main] IPC handlers setup complete");
