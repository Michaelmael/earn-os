const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

try {
  const dbPath = path.join(process.cwd(), 'users.db');
  console.log('Creating database at:', dbPath);
  
  const db = new Database(dbPath);
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      securityAnswer TEXT NOT NULL,
      emailVerified INTEGER DEFAULT 0,
      verificationCode TEXT,
      verificationCodeExpires DATETIME,
      isAdmin INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expiresAt DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);
  
  // Check if admin exists
  const adminEmail = 'mbuguamichael920@gmail.com';
  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  
  if (!existingAdmin) {
    const adminUsername = 'admin';
    const adminPassword = bcrypt.hashSync('Admin@2025', 10);
    const adminSecurity = bcrypt.hashSync('nairobi', 10);
    
    db.prepare(`
      INSERT INTO users (username, email, password, securityAnswer, emailVerified, isAdmin)
      VALUES (?, ?, ?, ?, 1, 1)
    `).run(adminUsername, adminEmail, adminPassword, adminSecurity);
    
    console.log('✅ Admin user created');
  } else {
    console.log('✅ Admin user already exists');
  }
  
  console.log('✅ Database setup complete');
  db.close();
  
} catch (error) {
  console.error('Database error:', error.message);
}
