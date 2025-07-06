// core/db.js
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'trader',
  host: 'localhost',
  database: 'trading_bot',
  password: 'secret123',
  port: 5432,
});
