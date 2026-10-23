import express from 'express';
import { pool } from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));

/* ----------------------------------------------------------------- utils --- */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

const normalizeDigits = (value) =>
  String(value)
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));

const clean = (value, max) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';

/* ------------------------------------------------------------ rate limit --- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now - entry.start > WINDOW_MS) hits.delete(ip);
  }
}, WINDOW_MS).unref();

/* ----------------------------------------------------------------- routes --- */

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, service: 'danial-chap-api' });
  } catch (error) {
    console.error('[health] database unreachable:', error.message);
    res.status(503).json({ ok: false });
  }
});

app.post('/api/orders', async (req, res) => {
  const ip = req.ip || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'تعداد درخواست‌ها زیاد بود. لطفاً چند دقیقه بعد دوباره تلاش کنید.',
    });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const name = clean(body.name, 120);
  const phone = normalizeDigits(clean(body.phone, 40)).replace(/[^\d]/g, '');
  const service = clean(body.service, 120);
  const printSize = clean(body.size, 200);
  const notes = clean(body.notes, 2000);

  const fields = {};
  if (name.length < 3) fields.name = 'نام خود را کامل وارد کنید.';
  if (phone.length < 10 || phone.length > 15) {
    fields.phone = 'شمارهٔ تماس معتبر نیست.';
  }
  if (!service) fields.service = 'نوع سفارش را انتخاب کنید.';

  if (Object.keys(fields).length > 0) {
    return res.status(422).json({ error: 'اطلاعات فرم کامل نیست.', fields });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO print_orders (name, phone, service, print_size, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [name, phone, service, printSize || null, notes || null],
    );

    const reference = `DC-${String(rows[0].id).padStart(5, '0')}`;
    console.log(`[orders] stored ${reference} (${service})`);
    return res.status(201).json({ reference, createdAt: rows[0].created_at });
  } catch (error) {
    console.error('[orders] insert failed:', error.message);
    return res.status(500).json({ error: 'ثبت درخواست ممکن نشد. لطفاً دوباره تلاش کنید.' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[api] unhandled error:', error.message);
  res.status(500).json({ error: 'خطای داخلی سرور.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[api] listening on http://0.0.0.0:${PORT}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`[api] ${signal} received, closing`);
    pool.end().finally(() => process.exit(0));
  });
}
