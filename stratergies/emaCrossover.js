// strategies/emaCrossover.js
import { EMA } from 'technicalindicators';

export default function emaCrossoverStrategy(closes, state, config) {
  const { shortPeriod, longPeriod, stopLoss = 0.98, takeProfit = 1.04 } = config;

  if (closes.length < longPeriod) {
    return { action: 'HOLD', reason: 'Not enough data for EMA' };
  }

  const shortEMA = EMA.calculate({ period: shortPeriod, values: closes });
  const longEMA = EMA.calculate({ period: longPeriod, values: closes });

  const latestShortEMA = shortEMA[shortEMA.length - 1];
  const latestLongEMA = longEMA[longEMA.length - 1];
  const latestPrice = closes[closes.length - 1];

  if (!latestShortEMA || !latestLongEMA) {
    return { action: 'HOLD', reason: 'EMA values not ready' };
  }

  // BUY signal: short EMA crosses above long EMA
  if (state.position === 'NONE' && latestShortEMA > latestLongEMA) {
    return {
      action: 'BUY',
      price: latestPrice,
      reason: `EMA crossover up: ${shortPeriod} > ${longPeriod}`
    };
  }

  // SELL signal
  if (state.position === 'HOLDING') {
    const priceChange = latestPrice / state.buyPrice;

    // Exit on crossover down
    if (latestShortEMA < latestLongEMA) {
      return {
        action: 'SELL',
        price: latestPrice,
        reason: `EMA crossover down: ${shortPeriod} < ${longPeriod}`
      };
    }

    if (priceChange <= stopLoss) {
      return { action: 'SELL', price: latestPrice, reason: 'STOP-LOSS triggered' };
    }

    if (priceChange >= takeProfit) {
      return { action: 'SELL', price: latestPrice, reason: 'TAKE-PROFIT hit' };
    }
  }

  return { action: 'HOLD', reason: 'No crossover or trigger' };
}
