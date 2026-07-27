import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { successResponse, errorResponse } from '../helpers/response';

const router = Router();

// GET /tasks - Ambil semua task (dengan filter status)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM tasks';
    let params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.json(successResponse(result.rows));
  } catch (err) {
    console.error('Error GET /tasks:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// GET /tasks/:id - Ambil satu task
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json(errorResponse('ID harus berupa angka'));
    }

    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json(errorResponse('Task tidak ditemukan'));
    }

    res.json(successResponse(result.rows[0]));
  } catch (err) {
    console.error('Error GET /tasks/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// POST /tasks - Buat task baru
router.post('/', async (req: Request, res: Response) => {
  try {
    const { project_id, assignee_id, judul, deskripsi, prioritas, deadline } = req.body;

    if (!project_id || !judul) {
      return res.status(400).json(errorResponse('project_id dan judul wajib diisi'));
    }

    const query = `
      INSERT INTO tasks (project_id, assignee_id, judul, deskripsi, prioritas, deadline)
      VALUES ($1, $2, $3, $4, COALESCE($5, 'medium'), $6)
      RETURNING *
    `;
    const result = await pool.query(
      query, 
      [project_id, assignee_id || null, judul, deskripsi, prioritas, deadline]
    );

    res.status(201).json(successResponse(result.rows[0], 'Task berhasil dibuat'));
  } catch (err: any) {
    console.error('Error POST /tasks:', err);
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json(errorResponse('project_id atau assignee_id tidak ditemukan'));
    }
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// PATCH /tasks/:id - Update status task
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json(errorResponse('ID harus berupa angka'));
    }
    if (!status) {
      return res.status(400).json(errorResponse('Status wajib diisi'));
    }

    const query = `
      UPDATE tasks
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      return res.status(404).json(errorResponse('Task tidak ditemukan'));
    }

    res.json(successResponse(result.rows[0], 'Status task berhasil diperbarui'));
  } catch (err) {
    console.error('Error PATCH /tasks/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// DELETE /tasks/:id - Hapus task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json(errorResponse('ID harus berupa angka'));
    }

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json(errorResponse('Task tidak ditemukan'));
    }

    res.json(successResponse(result.rows[0], 'Task berhasil dihapus'));
  } catch (err) {
    console.error('Error DELETE /tasks/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

export default router;