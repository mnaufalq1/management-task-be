import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { errorResponse, successResponse } from '../helpers/response';
import { supabase } from '../src/server';

const router = Router();

// GET /users - Ambil semua user
// Endpoint untuk mengambil semua data dari tabel users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows); // Mengembalikan array data user
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data dari Supabase' });
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

export default router;