import { Router, Request, Response } from "express";
import pool from "../config/database";
import { successResponse, errorResponse } from "../helpers/response";
import { title } from "process";

const router = Router();

// GET /projects - Ambil semua project
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
    res.json(successResponse(result.rows));
  } catch (err) {
    console.error("Error GET /projects:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// GET /projects/:id - Ambil detail project beserta task-nya
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json(errorResponse("ID harus berupa angka"));
      return;
    }

    const projectResult = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id],
    );
    if (projectResult.rowCount === 0) {
      res.status(404).json(errorResponse("Project tidak ditemukan"));
      return;
    }

    const tasksResult = await pool.query(
      "SELECT * FROM tasks WHERE project_id = $1 ORDER BY id ASC",
      [id],
    );

    const projectData = {
      ...projectResult.rows[0],
      tasks: tasksResult.rows,
    };

    res.json(successResponse(projectData));
  } catch (err) {
    console.error("Error GET /projects/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// POST /projects - Buat project baru
router.post("/", async (req: Request, res: Response) => {
  try {
    const { project_name, description, status } = req.body;

    if (!project_name) {
      res.status(400).json(errorResponse("Project name wajib diisi"));
      return;
    }

    const query = `
      INSERT INTO projects (project_name, description, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [
      project_name,
      description || null,
      status || "pending",
    ]);

    res
      .status(201)
      .json(successResponse(result.rows[0], "Project berhasil dibuat"));
  } catch (err) {
    console.error("Error POST /projects:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// PATCH /projects/:id - Update parsial data project
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json(errorResponse("ID harus berupa angka"));
      return;
    }

    const { project_name, description, status } = req.body;

    // Cek apakah ada data yang dikirim untuk di-update
    if (
      project_name === undefined &&
      description === undefined &&
      status === undefined
    ) {
      res
        .status(400)
        .json(
          errorResponse("Setidaknya kirimkan salah satu field untuk di-update"),
        );
      return;
    }

    // Ambil data project yang ada saat ini
    const existingProject = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id],
    );
    if (existingProject.rowCount === 0) {
      res.status(404).json(errorResponse("Project tidak ditemukan"));
      return;
    }

    // Gunakan nilai baru jika dikirim, atau pertahankan nilai lama jika undefined
    const updatedProjectName =
      project_name !== undefined
        ? project_name
        : existingProject.rows[0].project_name;
    const updatedDescription =
      description !== undefined
        ? description
        : existingProject.rows[0].description;
    const updatedStatus =
      status !== undefined ? status : existingProject.rows[0].status;

    const query = `
      UPDATE projects
      SET project_name = $1, description = $2, status = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [
      updatedProjectName,
      updatedDescription,
      updatedStatus,
      id,
    ]);

    res.json(successResponse(result.rows[0], "Project berhasil diperbarui"));
  } catch (err) {
    console.error("Error PATCH /projects/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

// DELETE /projects/:id - Hapus project
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if ((id === undefined || id === null)) {
      res.status(400).json(errorResponse("ID harus berupa angka"));
      return;
    }

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json(errorResponse("Project tidak ditemukan"));
      return;
    }

    res.json(successResponse(result.rows[0], "Project berhasil dihapus"));
  } catch (err) {
    console.error("Error DELETE /projects/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
});

export default router as any;
