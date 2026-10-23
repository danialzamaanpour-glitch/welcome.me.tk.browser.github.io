import { pool, SCHEMA } from '../db.js';

// Idempotent: safe to run on every boot.
const result = await pool.query(SCHEMA);
console.log(`[migrate] schema ready (${result.length} statements)`);
await pool.end();
