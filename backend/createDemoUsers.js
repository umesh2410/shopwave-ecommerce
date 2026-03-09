require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    const adminPass = await bcrypt.hash('Admin@123', 10);
    const userPass = await bcrypt.hash('Test@123', 10);

    const accounts = [
      { name: 'Admin User 2', email: 'admin2@shopwave.com', hash: adminPass, role: 'admin' },
      { name: 'Test User 2', email: 'testuser2@shopwave.com', hash: userPass, role: 'customer' }
    ];

    for (const acc of accounts) {
      const res = await db.query('SELECT id FROM users WHERE email = $1', [acc.email]);
      if (res.rows.length > 0) {
        await db.query('UPDATE users SET password_hash = $1, role = $2, is_active = true WHERE email = $3', [acc.hash, acc.role, acc.email]);
        console.log(`Updated ${acc.email}`);
      } else {
        await db.query('INSERT INTO users (name, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, true)', [acc.name, acc.email, acc.hash, acc.role]);
        console.log(`Inserted ${acc.email}`);
      }
    }
  } catch(e) {
    console.error('Error:', e);
  } finally {
    process.exit();
  }
}

seed();
