const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASS,
  port: process.env.POSTGRES_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;