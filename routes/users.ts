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
    res.status(500).json(errorResponse('Gagal mengambil data user'));
  }
});

// GET /users/:id - Ambil detail user berdasarkan ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json(errorResponse('ID harus berupa angka'));
      return;
    }

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json(errorResponse('User tidak ditemukan'));
      return;
    }

    res.json(successResponse(result.rows[0]));
  } catch (err) {
    console.error('Error GET /users/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// POST /users - Buat user baru (nama, email, role)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nama, email, role } = req.body;

    if (!nama || !email) {
      res.status(400).json(errorResponse('Nama dan email wajib diisi'));
      return;
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
    if (err.code === '23505') { // Unique violation (Email sudah terdaftar)
      res.status(400).json(errorResponse('Email sudah terdaftar'));
      return;
    }
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// PATCH /users/:id - Update parsial data user (nama, email, role)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json(errorResponse('ID harus berupa angka'));
      return;
    }

    const { nama, email, role } = req.body;

    // Cek apakah ada data yang dikirim
    if (nama === undefined && email === undefined && role === undefined) {
      res.status(400).json(errorResponse('Setidaknya kirimkan nama, email, atau role untuk di-update'));
      return;
    }

    // Ambil data user lama
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rowCount === 0) {
      res.status(404).json(errorResponse('User tidak ditemukan'));
      return;
    }

    const updatedNama = nama !== undefined ? nama : existingUser.rows[0].nama;
    const updatedEmail = email !== undefined ? email : existingUser.rows[0].email;
    const updatedRole = role !== undefined ? role : existingUser.rows[0].role;

    const query = `
      UPDATE users
      SET nama = $1, email = $2, role = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [updatedNama, updatedEmail, updatedRole, id]);

    res.json(successResponse(result.rows[0], 'User berhasil diperbarui'));
  } catch (err: any) {
    console.error('Error PATCH /users/:id:', err);
    if (err.code === '23505') {
      res.status(400).json(errorResponse('Email sudah digunakan oleh user lain'));
      return;
    }
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// DELETE /users/:id - Hapus user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json(errorResponse('ID harus berupa angka'));
      return;
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      res.status(404).json(errorResponse('User tidak ditemukan'));
      return;
    }

    res.json(successResponse(result.rows[0], 'User berhasil dihapus'));
  } catch (err) {
    console.error('Error DELETE /users/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

export default router as any;