// MYSQL ------------------------------------
const mysql = await import("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_URL!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// ------------------------------------------

// SQLITE ------------------------------------
// const Database = await import("better-sqlite3");

// let options = {};
// const pool = new Database("./cbm.db");
// pool.pragma("journal_mode = WAL");
// -------------------------------------------

export default pool;
