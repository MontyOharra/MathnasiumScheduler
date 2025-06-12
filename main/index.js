/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { initDatabase, getDatabase, closeDatabase } = require("./db");
const { spawn } = require("child_process");

let mainWindow;
let db = null;
let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds
let nextProcess = null;

function createWindow() {
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

  if (isDev) {
    loadDevServer();
  } else {
    // Use the same electron executable but run it in Node mode so we don't rely on an external node.exe
    const nodeBin = process.execPath; // Electron bundles its own Node binary
    const nextCli = path.join(
      __dirname,
      "..",
      "node_modules",
      "next",
      "dist",
      "bin",
      "next.cjs"
    );

    // Launch `next start -p 3000` in background (ELECTRON_RUN_AS_NODE tells electron to behave like pure node)
    nextProcess = spawn(nodeBin, [nextCli, "start", "-p", "3000"], {
      cwd: path.join(__dirname, ".."),
      env: {
        ...process.env,
        NODE_ENV: "production",
        ELECTRON_RUN_AS_NODE: "1",
      },
      stdio: "ignore",
      detached: true,
    });
    // Give server a little time, then load
    const prodUrl = "http://localhost:3000";
    const tryLoad = () => {
      mainWindow.loadURL(prodUrl).catch(() => setTimeout(tryLoad, 1000));
    };
    tryLoad();
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function loadDevServer() {
  const startUrl = "http://localhost:3000";

  mainWindow.loadURL(startUrl).catch((error) => {
    console.error("[Main] Failed to load development server:", error);

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(
        `[Main] Retrying in ${
          RETRY_DELAY / 1000
        } seconds... (Attempt ${retryCount}/${MAX_RETRIES})`
      );
      setTimeout(loadDevServer, RETRY_DELAY);
    } else {
      console.error(
        "[Main] Failed to connect to development server after maximum retries"
      );
      mainWindow.loadFile(path.join(__dirname, "../.next/index.html"));
    }
  });
}

app.on("ready", () => {
  createWindow();

  // Initialize the database
  try {
    db = initDatabase();
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
  if (nextProcess) {
    try {
      process.kill(-nextProcess.pid);
    } catch (_) {}
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Set up IPC handlers for database operations
ipcMain.handle("db-get-all", async (_, table) => {
  try {
    if (!db) db = getDatabase();
    return db.prepare(`SELECT * FROM ${table}`).all();
  } catch (error) {
    console.error("[Main] Error in db-get-all:", error);
    return { error: error.message };
  }
});

ipcMain.handle("db-get-by-id", async (_, table, id) => {
  try {
    if (!db) db = getDatabase();
    return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  } catch (error) {
    console.error("[Main] Error in db-get-by-id:", error);
    return { error: error.message };
  }
});

ipcMain.handle("db-insert", async (_, table, data) => {
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
