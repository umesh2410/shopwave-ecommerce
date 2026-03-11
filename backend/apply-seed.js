const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await client.connect();
    
    // Read the seed file
    const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed_demo.sql'), 'utf8');
    
    console.log("Executing seed_demo.sql...");
    await client.query(seedSql);
    console.log("Seed data insertion successful!");
    
    // Fetch users
    const res = await client.query('SELECT name, email, role FROM users');
    console.log("Users in database:", res.rows);
    
  } catch (err) {
    console.error("Error executing seed data:", err);
  } finally {
    await client.end();
  }
}

run();
