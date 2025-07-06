// core/tradeService.js
import { pool } from './db.js';

export async function logTrade(type, price, reason, strategy) {
  await pool.query(
    `INSERT INTO trades (strategy, type, price, reason)
     VALUES ($1, $2, $3, $4)`,
    [strategy, type, price, reason]
  );
  console.log(`[${strategy}] ${type} @ $${price} — ${reason}`);
}
