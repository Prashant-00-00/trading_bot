-- Table for trades
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  strategy VARCHAR(50),
  type VARCHAR(10),          -- BUY or SELL
  price NUMERIC,
  reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Table for strategy states
CREATE TABLE IF NOT EXISTS state (
  strategy VARCHAR(50) PRIMARY KEY,
  position VARCHAR(10),      -- NONE or HOLDING
  buy_price NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT now()
);
