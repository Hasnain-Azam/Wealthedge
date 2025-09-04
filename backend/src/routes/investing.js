import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const createSchema = z.object({
  amount: z.coerce.number().min(0),
  occurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(500).optional().default('')
});

router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, amount, note, occurred_on
     FROM investing_contributions
     WHERE user_id=$1
     ORDER BY occurred_on DESC, id DESC`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', requireAuth, validate(createSchema), async (req, res) => {
  const { amount, occurred_on, note } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO investing_contributions(user_id, amount, note, occurred_on)
     VALUES ($1, $2, $3, $4)
     RETURNING id, amount, note, occurred_on`,
    [req.user.id, amount, note, occurred_on]
  );
  res.json(rows[0]);
});

router.get('/summary/total', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(amount),0)::numeric::float8 AS total
     FROM investing_contributions
     WHERE user_id=$1`,
    [req.user.id]
  );
  res.json(rows[0]);
});

router.get('/summary/monthly', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT DATE_TRUNC('month', occurred_on) AS month,
            SUM(amount)::numeric::float8 AS total
     FROM investing_contributions
     WHERE user_id=$1
     GROUP BY 1
     ORDER BY 1 ASC`,
    [req.user.id]
  );
  res.json(rows);
});

export default router;
