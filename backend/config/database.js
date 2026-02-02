// Database Configuration and Initialization

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/Connect to database
const dbPath = path.join(__dirname, '../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table ready');
      }
    });

    // Create activity log table (optional)
    db.run(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating activity_logs table:', err);
      } else {
        console.log('Activity logs table ready');
      }
    });
  });
}

// Helper functions for database operations

// Get user by ID
const getUserById = (id, callback) => {
  db.get(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [id],
    callback
  );
};

// Get user by email
const getUserByEmail = (email, callback) => {
  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    callback
  );
};

// Get user by username
const getUserByUsername = (username, callback) => {
  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    callback
  );
};

// Get all users (admin only)
const getAllUsers = (callback) => {
  db.all(
    'SELECT id, username, email, role, created_at FROM users',
    callback
  );
};

// Create user
const createUser = (userData, callback) => {
  db.run(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [userData.username, userData.email, userData.password, userData.role || 'user'],
    callback
  );
};

// Update user
const updateUser = (id, userData, callback) => {
  const updates = [];
  const params = [];

  if (userData.username) {
    updates.push('username = ?');
    params.push(userData.username);
  }
  if (userData.email) {
    updates.push('email = ?');
    params.push(userData.email);
  }
  if (userData.role) {
    updates.push('role = ?');
    params.push(userData.role);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, params, callback);
};

// Delete user
const deleteUser = (id, callback) => {
  db.run('DELETE FROM users WHERE id = ?', [id], callback);
};

// Log activity
const logActivity = (userId, action, callback) => {
  db.run(
    'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
    [userId, action],
    callback
  );
};

module.exports = {
  db,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  logActivity
};
