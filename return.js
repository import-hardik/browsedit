const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
let chachedata="This is demo";
const { Pool } = require('pg');
require('dotenv').config();



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // needed if you're using a hosted server like Heroku or Render
  }
});




// Middleware to parse JSON
app.use(express.json({ limit: '500mb' }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

//syncing the to server
if (chachedata=="This is demo")
    cacheupdate("8334f379cb");
else
    console.log("already syncked");

// POST route to accept and respond with modified JSON
app.post('/data', (req, res) => {
  const userData = req.body;
  const text =userData.userid+userData.pass;
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  let response = {}; 
  if (hash === "8334f379cb82b1c5d2991c88d4234f33931636e9986a514f1e5d60e5b8e56be5")
  {
    response = {
      status: 'success',
      deviceID:hash.slice(0, 10),
      timestamp: new Date().toISOString(),
    };
  }
  else {
    response = {
      status: 'error',
      message: 'Invalid credentials',
    };
  }
  res.status(200).json(response);
});

app.post('/save', (req, res) => {
  const userData = req.body;
  const id =userData.userid;
  chachedata=userData.data;
  let response = {}; 
    response = {
      status: 'ok'
    };
  res.status(200).json(response);
});

app.post('/reload', (req, res) => {
  const userData = req.body;
  let response = {}; 
  if (userData.deviceID==="8334f379cb"){
      response = {
          status: 'sucesss',
          data:chachedata
        };
    }
    else {
    response = {
      status: 'error',
      message: 'Invalid credentials',
    };
  }
  res.status(200).json(response);
});

function cacheupdate(deviceID){
    pool.connect()
    .then(client => {
        console.log("✅ Connected to PostgreSQL using connection string");

        // const insertQuery = 'INSERT INTO user_data(userid, data) VALUES($1, $2) RETURNING *';
        const insertQuery = "SELECT data FROM user_data WHERE userid=$1";
        const values = [deviceID];

        return client.query(insertQuery, values)
        .then(res => {
            chachedata=res.rows[0]["data"];
            console.log("chache data updated");
        })
        .catch(err => {
            console.error("❌ Error:", err);
        })
        .finally(() => {
            client.release();
        })
    });
} 
setInterval(()=>{savetodb("8334f379cb")}, 600000);
function savetodb(deviceID){
        pool.connect()
    .then(client=> {
        console.log("✅ Connected to PostgreSQL using connection string");

        // const insertQuery = 'INSERT INTO user_data(userid, data) VALUES($1, $2) RETURNING *';
    const insertQuery = 'UPDATE user_data SET data = $2, timestamp = $3 WHERE userid = $1  RETURNING *';
    const values = [deviceID,chachedata,new Date().toISOString()];

        return pool.query(insertQuery, values)
        .then(res => {
            console.log("syncing user"+res.rows[0].userid);
            console.log("chache data synched with db");
        })
        .catch(err => {
            console.error("❌ Error:", err);
        })
        .finally(() => {
            client.release();
        });
    })
} 

function submitdata() {
  fetch('https://coldfix.onrender.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userid: "dummy",
    pass: "dummy"
  })
})
.then(response => response.json())
.then(data =>{
    console.log("Server Running on "+new Date().toISOString());
    console.log(data);
}
    )
.catch(error => console.error('Error:', error));
  return 0;
}
setInterval(submitdata, 60 * 1000);



// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
