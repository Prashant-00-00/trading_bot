// core/stateService.js
import { pool } from './db.js';

export async function getState() {
  const res = await pool.query('SELECT * FROM state');
  const state = {};
  res.rows.forEach(row => {
    state[row.strategy] = {
      position: row.position,
      buyPrice: parseFloat(row.buy_price)
    };
  });
  return state;
}

export async function updateState(strategy, position, buyPrice) {
  await pool.query(
    `INSERT INTO state (strategy, position, buy_price, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (strategy) DO UPDATE
     SET position = $2, buy_price = $3, updated_at = NOW()`,
    [strategy, position, buyPrice]
  );
}
