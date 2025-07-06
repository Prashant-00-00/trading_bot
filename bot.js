import WebSocket from 'ws';
import { runAllStrategies } from './core/strategyEngine.js';
import { getState, updateState } from './core/stateService.js';
import { logTrade } from './core/tradeService.js';

const SYMBOL = 'btcusdt';
const INTERVAL = '1m';
const closes = [];

const runBot = async () => {
  console.log(`\n🕒 Running bot at ${new Date().toLocaleTimeString()}`);

  if (closes.length < 21) {
    console.log('Waiting for more candles...');
    return;
  }

  const state = await getState();
  const results = runAllStrategies(closes, state);

  for (const result of results) {
    const { strategy, action, price, reason } = result;

    if (!state[strategy]) {
      await updateState(strategy, 'NONE', 0);
      state[strategy] = { position: 'NONE', buyPrice: 0 };
    }

    if (action === 'BUY') {
      await logTrade('BUY', price, reason, strategy);
      await updateState(strategy, 'HOLDING', price);
    } else if (action === 'SELL') {
      await logTrade('SELL', price, reason, strategy);
      await updateState(strategy, 'NONE', 0);
    } else {
      console.log(`[${strategy}] HOLD - ${reason}`);
    }
  }
};

const startWebSocket = () => {
  const streamName = `${SYMBOL}@kline_${INTERVAL}`;
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`);

  ws.on('open', () => console.log('📡 Connected to Binance WebSocket'));

  ws.on('message', async (data) => {
    const json = JSON.parse(data);
    const candle = json.k;

    if (candle.x) {
      const closePrice = parseFloat(candle.c);
      closes.push(closePrice);
      if (closes.length > 100) closes.shift();

      await runBot();
    }
  });

  ws.on('error', err => console.error('WebSocket error:', err.message));
  ws.on('close', () => {
    console.log('🔌 WS closed. Reconnecting...');
    setTimeout(startWebSocket, 5000);
  });
};

startWebSocket();
