import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const catSchema = z.object({ name: z.string().min(1).max(40) });

const createExpenseSchema = z.object({
  amount: z.coerce.number().min(0),
  currency: z.string().min(1).max(8).default('CAD'),
  merchant: z.string().max(120).optional().default(''),
  note: z.string().max(500).optional().default(''),
  category: z.string().max(40).optional(),
  incurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

const updateExpenseSchema = z.object({
  amount: z.coerce.number().min(0).optional(),
  currency: z.string().min(1).max(8).optional(),
  merchant: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
  category: z.string().max(40).optional(),
  incurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

// Ensure default categories for a user
async function ensureDefaults(userId) {
  const defaults = ['Food', 'Transport', 'Rent', 'Bills', 'Shopping', 'Other'];
  for (const name of defaults) {
    await pool.query(
      'INSERT INTO categories(user_id, name) VALUES($1, $2) ON CONFLICT (user_id, name) DO NOTHING',
      [userId, name]
    );
  }
}

router.get('/categories', requireAuth, async (req, res) => {
  await ensureDefaults(req.user.id);
  const { rows } = await pool.query('SELECT id, name FROM categories WHERE user_id=$1 ORDER BY name', [req.user.id]);
  res.json(rows);
});

router.post('/categories', requireAuth, validate(catSchema), async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO categories(user_id, name) VALUES($1, $2) RETURNING id, name',
      [req.user.id, name]
    );
    res.json(rows[0]);
  } catch {
    res.status(400).json({ message: 'Category may already exist' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT e.id, e.amount, e.currency, e.merchant, e.note, e.incurred_on, c.name as category
     FROM expenses e
     LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.user_id=$1
     ORDER BY e.incurred_on DESC, e.id DESC`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', requireAuth, validate(createExpenseSchema), async (req, res) => {
  let { amount, currency, merchant, note, category, incurred_on } = req.body;
  try {
    let categoryId = null;
    if (category) {
      const cat = await pool.query(
        'INSERT INTO categories(user_id, name) VALUES($1, $2) ON CONFLICT (user_id, name) DO UPDATE SET name=EXCLUDED.name RETURNING id',
        [req.user.id, category]
      );
      categoryId = cat.rows[0].id;
    }
    const { rows } = await pool.query(
      `INSERT INTO expenses(user_id, category_id, amount, currency, merchant, note, incurred_on)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, amount, currency, merchant, note, incurred_on`,
      [req.user.id, categoryId, amount, currency, merchant, note, incurred_on]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', requireAuth, validate(updateExpenseSchema), async (req, res) => {
  const id = Number(req.params.id);
  const { amount, currency, merchant, note, category, incurred_on } = req.body;
  try {
    let categoryId = null;
    if (category) {
      const cat = await pool.query(
        'INSERT INTO categories(user_id, name) VALUES($1, $2) ON CONFLICT (user_id, name) DO UPDATE SET name=EXCLUDED.name RETURNING id',
        [req.user.id, category]
      );
      categoryId = cat.rows[0].id;
    }
    await pool.query(
      `UPDATE expenses SET
         amount=COALESCE($1, amount),
         currency=COALESCE($2, currency),
         merchant=COALESCE($3, merchant),
         note=COALESCE($4, note),
         category_id=COALESCE($5, category_id),
         incurred_on=COALESCE($6, incurred_on)
       WHERE id=$7 AND user_id=$8`,
      [amount, currency, merchant, note, categoryId, incurred_on, id, req.user.id]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('DELETE FROM expenses WHERE id=$1 AND user_id=$2', [id, req.user.id]);
  res.json({ ok: true });
});

router.get('/summary/monthly', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT DATE_TRUNC('month', incurred_on) AS month, SUM(amount)::numeric::float8 as total
     FROM expenses
     WHERE user_id=$1
     GROUP BY 1
     ORDER BY 1 ASC`,
    [req.user.id]
  );
  res.json(rows);
});

router.get('/summary/by-category', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT COALESCE(c.name, 'Uncategorized') AS category, SUM(e.amount)::numeric::float8 as total
     FROM expenses e
     LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.user_id=$1
     GROUP BY 1
     ORDER BY total DESC`,
    [req.user.id]
  );
  res.json(rows);
});

export default router;
