import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { successResponse, errorResponse } from '../helpers/response';

const router = Router();

// GET /projects - Ambil semua project
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id ASC');
    res.json(successResponse(result.rows));
  } catch (err) {
    console.error('Error GET /projects:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// GET /projects/:id - Ambil detail project beserta task-nya
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json(errorResponse('ID harus berupa angka'));
    }

    const projectResult = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (projectResult.rowCount === 0) {
      return res.status(404).json(errorResponse('Project tidak ditemukan'));
    }

    const tasksResult = await pool.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY id ASC', [id]);

    const projectData = {
      ...projectResult.rows[0],
      tasks: tasksResult.rows,
    };

    res.json(successResponse(projectData));
  } catch (err) {
    console.error('Error GET /projects/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

// POST /projects - Buat project baru
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nama, deskripsi } = req.body;

    if (!nama) {
      return res.status(400).json(errorResponse('Nama project wajib diisi'));
    }

    const query = `
      INSERT INTO projects (nama, deskripsi)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [nama, deskripsi]);

    res.status(201).json(successResponse(result.rows[0], 'Project berhasil dibuat'));
  } catch (err) {
    console.error('Error POST /projects:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
});

export default router;