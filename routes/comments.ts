import { Router, Request, Response } from "express";
import pool from "../config/database";
import { errorResponse, successResponse } from "../helpers/response";

const router = Router();

// GET /comments - Ambil semua komentar (Opsional: ?task_id=... atau ?user_id=...)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { task_id, user_id } = req.query;

    let query = "SELECT * FROM comments";
    const params: any[] = [];
    const conditions: string[] = [];

    if (task_id) {
      params.push(task_id);
      conditions.push(`task_id = $${params.length}`);
    }

    if (user_id) {
      params.push(user_id);
      conditions.push(`user_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.json(successResponse(result.rows));
  } catch (err) {
    console.error("Error GET /comments:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// GET /comments/:id - Ambil detail komentar berdasarkan ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await pool.query("SELECT * FROM comments WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).json(errorResponse("Komentar tidak ditemukan"));
      return;
    }

    res.json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("Error GET /comments/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// POST /comments - Buat komentar baru
router.post("/", async (req: Request, res: Response) => {
  try {
    const { comment, task_id, user_id } = req.body;

    if (!comment || !task_id || !user_id) {
      res
        .status(400)
        .json(errorResponse("comment, task_id, dan user_id wajib diisi"));
      return;
    }

    const query = `
      INSERT INTO comments (comment, task_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [
      comment,
      task_id,
      user_id,
    ]);

    res
      .status(201)
      .json(successResponse(result.rows[0], "Komentar berhasil ditambahkan"));
  } catch (err: any) {
    console.error("Error POST /comments:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// PATCH /comments/:id - Edit komentar
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { comment } = req.body;

    if (!comment) {
      res.status(400).json(errorResponse("Teks komentar wajib diisi"));
      return;
    }

    const query = `
      UPDATE comments
      SET comment = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [comment, id]);

    if (result.rowCount === 0) {
      res.status(404).json(errorResponse("Komentar tidak ditemukan"));
      return;
    }

    res.json(successResponse(result.rows[0], "Komentar berhasil diperbarui"));
  } catch (err) {
    console.error("Error PATCH /comments/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// DELETE /comments/:id - Hapus komentar
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await pool.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json(errorResponse("Komentar tidak ditemukan"));
      return;
    }

    res.json(successResponse(result.rows[0], "Komentar berhasil dihapus"));
  } catch (err) {
    console.error("Error DELETE /comments/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

export default router as any;
