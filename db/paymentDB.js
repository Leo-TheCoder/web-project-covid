const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.POSTGRES_USER_PAYMENT,
  host: process.env.POSTGRES_HOST_PAYMENT,
  database: process.env.POSTGRES_DATABASE_PAYMENT,
  password: process.env.POSTGRES_PASS_PAYMENT,
  port: process.env.POSTGRES_PORT_PAYMENT,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;