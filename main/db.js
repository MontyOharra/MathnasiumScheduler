/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const isDev = require("electron-is-dev");
const {
  createTables,
  populateLookupTables,
  populateTestData,
} = require("./db-helpers");

// Define paths for different environments
const getDatabasePath = () => {
  if (isDev) {
    // In development, store in project directory
    return path.join(process.cwd(), "mathnasium.db");
  } else {
    // In production, store in user data directory
    return path.join(app.getPath("userData"), "mathnasium.db");
  }
};

// Database connection
let db = null;

// Initialize database
const initDatabase = () => {
  const dbPath = getDatabasePath();

  // Use app.log for main process logging
  app.log = app.log || console.log;
  app.error = app.error || console.error;


  try {
    // Delete database file in development mode
    if (isDev && fs.existsSync(dbPath)) {
      app.log("Development mode: Deleting existing database file");
      fs.unlinkSync(dbPath);
    }

    // Ensure directory exists for production
    if (!isDev) {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Create/open database connection
    db = new Database(dbPath);

    // Enable foreign keys
    db.pragma("foreign_keys = ON");

    // Create tables using the helper function
    createTables(db);
    // Populate lookup tables using the helper function
    populateLookupTables(db);

    // Populate test data
    populateTestData(db);

    return db;
  } catch (error) {
    app.error("Database initialization error:", error);
    throw error;
  }
};

// Get database instance
const getDatabase = () => {
  if (!db) {
    return initDatabase();
  }
  return db;
};

// Close database connection
const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
    app.log("Database connection closed");
  }
};

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
};
