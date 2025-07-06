
// core/strategyEngine.js
import rsiStrategy from '../strategies/rsiStrategy.js';
import emaStrategy from '../strategies/emaCrossover.js';
import config from '../strategies/config.json' assert { type: "json" };

const strategies = {
  RSI: rsiStrategy,
  EMA_CROSS: emaStrategy
};

export function runAllStrategies(closes, state) {
  const results = [];

  for (const [name, strategyFn] of Object.entries(strategies)) {
    if (!config[name]?.enabled) continue;
    const strategyState = state[name] || { position: 'NONE', buyPrice: 0 };
    const result = strategyFn(closes, strategyState, config[name]);
    results.push({ strategy: name, ...result });
  }

  return results;
}
