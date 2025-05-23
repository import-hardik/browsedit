const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

// keep server alive
setInterval(() => {
  console.log("Pinging Server", new Date().toLocaleString())
  client.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL using connection string");
    return null;
  })
  .then(res => {
    console.log("Server Refresh Time");
  })
  .catch(err => {
    console.error("❌ Error:", err);
  })
  .finally(() => {
    client.end();
  });
}
,4 * 60 * 1000);