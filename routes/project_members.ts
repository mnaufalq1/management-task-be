import { Router, Request, Response } from "express";
import pool from "../config/database";
import { errorResponse, successResponse } from "../helpers/response";

const router = Router();

// GET /project_members - Ambil semua project member
router.get("/", async (req: Request, res: Response) => {
  try {
    const { project_id, user_id } = req.query;

    let query = "SELECT * FROM project_members";
    const params: any[] = [];
    const conditions: string[] = [];

    if (project_id) {
      params.push(project_id);
      conditions.push(`project_id = $${params.length}`);
    }

    if (user_id) {
      params.push(user_id);
      conditions.push(`user_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY id ASC";

    const result = await pool.query(query, params);
    res.json(successResponse(result.rows));
  } catch (err) {
    console.error("Error GET /project_members:", err);
    res.status(500).json(errorResponse("Gagal mengambil data project member"));
  }
});

// GET /project_members/:id - Ambil detail project member berdasarkan ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (id === undefined || id === null) {
      res.status(400).json(errorResponse("ID tidak valid"));
      return;
    }

    const result = await pool.query(
      "SELECT * FROM project_members WHERE id = $1",
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json(errorResponse("Project member tidak ditemukan"));
      return;
    }

    res.json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("Error GET /project_members/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// POST /project_members - Tambahkan member ke project (project_id, user_id, role)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { project_id, user_id, role } = req.body;

    if (!project_id || !user_id) {
      res.status(400).json(errorResponse("project_id dan user_id wajib diisi"));
      return;
    }

    const query = `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, COALESCE($3, 'member'))
      RETURNING *
    `;
    const result = await pool.query(query, [project_id, user_id, role]);

    res
      .status(201)
      .json(
        successResponse(result.rows[0], "Project member berhasil ditambahkan"),
      );
  } catch (err: any) {
    console.error("Error POST /project_members:", err);
    if (err.code === "23505") {
      // Unique constraint violation (Member sudah terdaftar di project ini)
      res
        .status(400)
        .json(errorResponse("User sudah terdaftar dalam project ini"));
      return;
    }
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// PATCH /project_members/:id - Update parsial data project member (project_id, user_id, role)
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (id === undefined || id === null) {
      res.status(400).json(errorResponse("ID tidak valid"));
      return;
    }

    const { project_id, user_id, role } = req.body;

    // Cek apakah ada data yang dikirim
    if (
      project_id === undefined &&
      user_id === undefined &&
      role === undefined
    ) {
      res
        .status(400)
        .json(
          errorResponse(
            "Setidaknya kirimkan project_id, user_id, atau role untuk di-update",
          ),
        );
      return;
    }

    // Ambil data lama
    const existingMember = await pool.query(
      "SELECT * FROM project_members WHERE id = $1",
      [id],
    );
    if (existingMember.rowCount === 0) {
      res.status(404).json(errorResponse("Project member tidak ditemukan"));
      return;
    }

    const updatedProjectId =
      project_id !== undefined ? project_id : existingMember.rows[0].project_id;
    const updatedUserId =
      user_id !== undefined ? user_id : existingMember.rows[0].user_id;
    const updatedRole = role !== undefined ? role : existingMember.rows[0].role;

    const query = `
      UPDATE project_members
      SET project_id = $1, user_id = $2, role = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [
      updatedProjectId,
      updatedUserId,
      updatedRole,
      id,
    ]);

    res.json(
      successResponse(result.rows[0], "Project member berhasil diperbarui"),
    );
  } catch (err: any) {
    console.error("Error PATCH /project_members/:id:", err);
    if (err.code === "23505") {
      res
        .status(400)
        .json(errorResponse("User sudah terdaftar dalam project ini"));
      return;
    }
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// DELETE /project_members/:id - Hapus project member
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (id === undefined || id === null) {
      res.status(400).json(errorResponse("ID tidak valid"));
      return;
    }

    const result = await pool.query(
      "DELETE FROM project_members WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json(errorResponse("Project member tidak ditemukan"));
      return;
    }

    res.json(
      successResponse(result.rows[0], "Project member berhasil dihapus"),
    );
  } catch (err) {
    console.error("Error DELETE /project_members/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

export default router as any;
