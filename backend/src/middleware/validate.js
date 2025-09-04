import { ZodError } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: e.flatten() });
      }
      next(e);
    }
  }
}
