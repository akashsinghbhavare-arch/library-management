// Database Seeding Script - Creates Default Admin User

const bcrypt = require('bcryptjs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
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
        process.exit(1);
      } else {
        console.log('Users table ready');
        seedDatabase();
      }
    });
  });
}

function seedDatabase() {
  // Check if admin user already exists
  db.get('SELECT * FROM users WHERE username = ?', ['apsz'], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      process.exit(1);
    }

    if (row) {
      console.log('\n✓ Admin user already exists');
      console.log('\n Admin Credentials:');
      console.log('   Username: apsz');
      console.log('   Password: apsz04');
      db.close();
      process.exit(0);
    }

    // Create admin user with correct credentials
    const hashedPassword = bcrypt.hashSync('apsz04', 10);

    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['apsz', 'admin@apszlibrary.com', hashedPassword, 'admin'],
      function(err) {
        if (err) {
          console.error('Error creating admin user:', err);
          process.exit(1);
        }

        console.log('\n' + '='.repeat(50));
        console.log('✓ Admin user created successfully!');
        console.log('='.repeat(50));
        console.log('\n Admin Credentials:');
        console.log('   Username: apsz');
        console.log('   Password: apsz04');
        console.log('\n ⚠️  Keep these credentials safe!');
        console.log('='.repeat(50) + '\n');

        db.close();
        process.exit(0);
      }
    );
  });
}
