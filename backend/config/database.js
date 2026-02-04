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
        phone TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table ready');
        // Add phone column if it doesn't exist
        db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, (alterErr) => {
          if (alterErr && !alterErr.message.includes('duplicate column')) {
            console.error('Note: Could not add phone column (may already exist)');
          }
        });
      }
    });

    // Create books table
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        isbn TEXT UNIQUE,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating books table:', err);
      } else {
        console.log('Books table ready');
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

    // Create borrow_records table
    db.run(`
      CREATE TABLE IF NOT EXISTS borrow_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id INTEGER,
        book_title TEXT NOT NULL,
        issue_date TEXT NOT NULL,
        return_date TEXT NOT NULL,
        actual_return_date TEXT,
        status TEXT DEFAULT 'active',
        fine_amount REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating borrow_records table:', err);
      } else {
        console.log('Borrow records table ready');
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

// Create borrow record
const createBorrowRecord = (borrowData, callback) => {
  db.run(
    'INSERT INTO borrow_records (user_id, book_id, book_title, issue_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?)',
    [borrowData.user_id, borrowData.book_id, borrowData.book_title, borrowData.issue_date, borrowData.return_date, 'active'],
    function(err) {
      callback(err, this.lastID);
    }
  );
};

// Get all borrow records
const getAllBorrowRecords = (callback) => {
  db.all(
    `SELECT br.*, u.username, u.email FROM borrow_records br 
     LEFT JOIN users u ON br.user_id = u.id 
     ORDER BY br.created_at DESC`,
    callback
  );
};

// Get active borrow records (currently issued)
const getActiveBorrowRecords = (callback) => {
  db.all(
    `SELECT br.*, u.username, u.email FROM borrow_records br
     LEFT JOIN users u ON br.user_id = u.id
     WHERE br.status = 'active'
     ORDER BY br.created_at DESC`,
    callback
  );
};

// Get borrow records for a user
const getUserBorrowRecords = (userId, callback) => {
  db.all(
    `SELECT * FROM borrow_records WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
    callback
  );
};

// Mark borrow record as returned
const markBorrowReturned = (borrowId, actualReturnDate, callback) => {
  db.run(
    'UPDATE borrow_records SET status = ?, actual_return_date = ? WHERE id = ?',
    ['returned', actualReturnDate, borrowId],
    callback
  );
};

// Get total members count
const getTotalMembers = (callback) => {
  db.get(
    'SELECT COUNT(*) as count FROM users WHERE role = "user"',
    callback
  );
};

// Get total books issued (active borrow records)
const getTotalBooksIssued = (callback) => {
  db.get(
    'SELECT COUNT(*) as count FROM borrow_records WHERE status = "active"',
    callback
  );
};

// Get overdue books count
const getOverdueBooks = (callback) => {
  db.get(
    `SELECT COUNT(*) as count FROM borrow_records 
     WHERE status = "active" AND return_date < date('now')`,
    callback
  );
};

// Get total books (from books table)
const getTotalBooks = (callback) => {
  db.get(
    'SELECT COUNT(*) as count FROM books',
    callback
  );
};

// Book operations
const addBook = (bookData, callback) => {
  db.run(
    'INSERT INTO books (title, author, category, isbn) VALUES (?, ?, ?, ?)',
    [bookData.title, bookData.author, bookData.category, bookData.isbn || null],
    function(err) {
      callback(err, this.lastID);
    }
  );
};

const getAllBooks = (callback) => {
  db.all(
    'SELECT * FROM books ORDER BY created_at DESC',
    callback
  );
};

const deleteBook = (bookId, callback) => {
  db.run(
    'DELETE FROM books WHERE id = ?',
    [bookId],
    callback
  );
};

// Update book status (e.g., 'issued' or 'available')
const updateBookStatus = (bookId, status, callback) => {
  db.run(
    'UPDATE books SET status = ? WHERE id = ?',
    [status, bookId],
    callback
  );
};
// Member operations (using users table)
const addMember = (memberData, callback) => {
  const hashedPassword = require('bcryptjs').hashSync(memberData.password || 'default123', 10);
  db.run(
    'INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
    [memberData.name, memberData.email, hashedPassword, memberData.phone, 'user'],
    function(err) {
      callback(err, this.lastID);
    }
  );
};

const getAllMembers = (callback) => {
  db.all(
    'SELECT id, username as name, email, phone, created_at FROM users WHERE role = "user" ORDER BY created_at DESC',
    callback
  );
};

const deleteMember = (memberId, callback) => {
  db.run(
    'DELETE FROM users WHERE id = ? AND role = "user"',
    [memberId],
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
  logActivity,
  createBorrowRecord,
  getAllBorrowRecords,
  getActiveBorrowRecords,
  getUserBorrowRecords,
  markBorrowReturned,
  getTotalMembers,
  getTotalBooksIssued,
  getOverdueBooks,
  getTotalBooks,
  addBook,
  getAllBooks,
  deleteBook,
  updateBookStatus,
  addMember,
  getAllMembers,
  deleteMember
};
