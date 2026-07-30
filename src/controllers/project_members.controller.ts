import { Request, Response } from "express";
import { errorResponse, successResponse } from "../helpers/response.js";
import * as projectMemberService from "../services/project_members.service.js";

// GET /project_members - Ambil semua project member
export const getProjectMembers = async (req: Request, res: Response) => {
  try {
    // Penggunaan String() yang aman untuk query parameter
    const project_id = req.query.project_id ? String(req.query.project_id) : undefined;
    const user_id = req.query.user_id ? String(req.query.user_id) : undefined;

    const members = await projectMemberService.findAllProjectMembers(
      project_id,
      user_id
    );
    res.json(successResponse(members));
  } catch (err) {
    console.error("Error GET /project_members:", err);
    res.status(500).json(errorResponse("Gagal mengambil data project member"));
  }
};

// GET /project_members/:id - Ambil detail project member berdasarkan ID
export const getProjectMemberById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!id) {
      res.status(400).json(errorResponse("ID tidak valid"));
      return;
    }

    const member = await projectMemberService.findProjectMemberById(id);
    if (!member) {
      res.status(404).json(errorResponse("Project member tidak ditemukan"));
      return;
    }

    res.json(successResponse(member));
  } catch (err) {
    console.error("Error GET /project_members/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
};

// POST /project_members - Tambahkan member ke project
export const createProjectMember = async (req: Request, res: Response) => {
  try {
    const { project_id, user_id } = req.body;

    if (!project_id || !user_id) {
      res.status(400).json(errorResponse("project_id dan user_id wajib diisi"));
      return;
    }

    const newMember = await projectMemberService.insertProjectMember(req.body);
    res
      .status(201)
      .json(
        successResponse(newMember, "Project member berhasil ditambahkan")
      );
  } catch (err: any) {
    console.error("Error POST /project_members:", err);
    if (err.code === "23505") {
      res
        .status(400)
        .json(errorResponse("User sudah terdaftar dalam project ini"));
      return;
    }
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
};

// PATCH /project_members/:id - Update parsial data project member
export const updateProjectMember = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!id) {
      res.status(400).json(errorResponse("ID tidak valid"));
      return;
    }

    const { project_id, user_id } = req.body;

    if (project_id === undefined && user_id === undefined) {
      res
        .status(400)
        .json(
          errorResponse(
            "Setidaknya kirimkan project_id atau user_id untuk di-update"
          )
        );
      return;
    }

    const updatedMember = await projectMemberService.updateProjectMemberById(
      id,
      req.body
    );

    if (!updatedMember) {
      res.status(404).json(errorResponse("Project member tidak ditemukan"));
      return;
    }

    res.json(
      successResponse(updatedMember, "Project member berhasil diperbarui")
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
};

// DELETE /project_members/:id - Hapus project member
export const deleteProjectMember = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!id) {
      res.status(400).json(errorResponse("ID tidak valid"));
      return;
    }

    const deletedMember = await projectMemberService.deleteProjectMemberById(id);
    if (!deletedMember) {
      res.status(404).json(errorResponse("Project member tidak ditemukan"));
      return;
    }

    res.json(
      successResponse(deletedMember, "Project member berhasil dihapus")
    );
  } catch (err) {
    console.error("Error DELETE /project_members/:id:", err);
    res.status(500).json(errorResponse("Terjadi kesalahan di server"));
  }
};