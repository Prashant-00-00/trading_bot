// strategies/rsiStrategy.js
import { RSI } from 'technicalindicators';

export default function rsiStrategy(closes, state, config) {
  const { period, oversold, overbought, takeProfit, stopLoss } = config;

  const rsiValues = RSI.calculate({ values: closes, period });
  const latestRSI = rsiValues[rsiValues.length - 1];
  const latestPrice = closes[closes.length - 1];

  if (!latestRSI || closes.length < period) {
    return { action: 'HOLD', reason: 'Not enough data' };
  }

  if (state.position === 'NONE' && latestRSI < oversold) {
    return { action: 'BUY', price: latestPrice, reason: `RSI ${latestRSI.toFixed(2)} < ${oversold}` };
  }

  if (state.position === 'HOLDING') {
    const priceChange = latestPrice / state.buyPrice;

    if (latestRSI > overbought) {
      return { action: 'SELL', price: latestPrice, reason: `RSI ${latestRSI.toFixed(2)} > ${overbought}` };
    }

    if (priceChange <= stopLoss) {
      return { action: 'SELL', price: latestPrice, reason: 'STOP-LOSS triggered' };
    }

    if (priceChange >= takeProfit) {
      return { action: 'SELL', price: latestPrice, reason: 'TAKE-PROFIT hit' };
    }
  }

  return { action: 'HOLD', reason: 'No conditions met' };
}
