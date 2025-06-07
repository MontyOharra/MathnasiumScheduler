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

  app.log(`Initializing database at: ${dbPath}`);

  try {
    // Ensure directory exists for production
    if (!isDev) {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Create/open database connection
    db = new Database(dbPath);
    app.log("Database connection established");

    // Enable foreign keys
    db.pragma("foreign_keys = ON");
    app.log("Foreign keys enabled");

    // Create tables using the helper function
    app.log("Creating database tables...");
    createTables(db);
    app.log("Tables created successfully");

    // Populate lookup tables using the helper function
    app.log("Populating lookup tables...");
    populateLookupTables(db);
    app.log("Lookup tables populated successfully");

    // Populate test data
    app.log("Populating test data...");
    populateTestData(db);
    app.log("Test data populated successfully");

    app.log("Database initialized successfully");
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
