import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { errorResponse, successResponse } from '../helpers/response';

const router = Router();

// GET /users - Ambil semua user
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(successResponse(result.rows));
  } catch (err) {
    console.error('Error GET /users:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// POST /users - Buat user baru (nama, email, role)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nama, email, role } = req.body;

    if (!nama || !email) {
      return res.status(400).json(errorResponse('Nama dan email wajib diisi'));
    }

    const query = `
      INSERT INTO users (nama, email, role)
      VALUES ($1, $2, COALESCE($3, 'member'))
      RETURNING *
    `;
    const result = await pool.query(query, [nama, email, role]);

    res.status(201).json(successResponse(result.rows[0], 'User berhasil dibuat'));
  } catch (err: any) {
    console.error('Error POST /users:', err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json(errorResponse('Email sudah terdaftar'));
    }
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

export default pool;