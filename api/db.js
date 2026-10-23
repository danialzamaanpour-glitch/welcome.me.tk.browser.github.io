import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  idleTimeoutMillis: 10_000,
});

pool.on('error', (error) => {
  console.error('[db] idle client error', error.message);
});

export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS print_orders (
    id          SERIAL PRIMARY KEY,
    name        TEXT        NOT NULL,
    phone       TEXT        NOT NULL,
    service     TEXT        NOT NULL,
    print_size  TEXT,
    notes       TEXT,
    status      TEXT        NOT NULL DEFAULT 'new',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS print_orders_created_at_idx ON print_orders (created_at DESC);
`;
