const { Client } = require('pg');
require('dotenv').config();
// Use your full PostgreSQL connection string here
// const connectionString = 'postgres://username:password@host:port/database';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // needed if you're using a hosted server like Heroku or Render
  }
});

client.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL using connection string");

    // const insertQuery = const insertQuery = 'INSERT INTO user_data(userid, data) VALUES($1, $2) RETURNING *';
    const insertQuery = 'UPDATE user_data SET data = $2 WHERE userid = $1  RETURNING *';
    const values = ['45tt45t546', 'This is a sample text for validation perpose only not corruspond to actual data'];

    return client.query(insertQuery, values);
  })
  .then(res => {
    console.log("✅ Data inserted:", res.rows[0]);
  })
  .catch(err => {
    console.error("❌ Error:", err);
  })
  .finally(() => {
    client.end();
  });
