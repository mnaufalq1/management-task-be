import { successResponse, errorResponse } from '../helpers/response.js';
import * as projectService from '../services/projects.service.js';
// GET /projects
export const getProjects = async (req, res) => {
    try {
        const projects = await projectService.findAllProjects();
        res.json(successResponse(projects));
    }
    catch (err) {
        console.error('Error GET /projects:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// GET /projects/:id
export const getProjectById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const project = await projectService.findProjectById(id);
        if (!project) {
            return res.status(404).json(errorResponse('Project tidak ditemukan'));
        }
        res.json(successResponse(project));
    }
    catch (err) {
        console.error('Error GET /projects/:id:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// POST /projects
export const createProject = async (req, res) => {
    try {
        const { project_name, description, status } = req.body;
        if (!project_name || !description || !status) {
            return res.status(400).json(errorResponse('Semua field wajib diisi'));
        }
        const newProject = await projectService.insertProject(req.body);
        res.status(201).json(successResponse(newProject, 'Project berhasil dibuat'));
    }
    catch (err) {
        console.error('Error POST /projects:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// PATCH /projects
export const updateProject = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { project_name, description, status } = req.body;
        if (!project_name || !description || !status) {
            return res.status(400).json(errorResponse('Semua field wajib diisi'));
        }
        const updatedProject = await projectService.updateProjectById(id, req.body);
        if (!updatedProject) {
            return res.status(404).json(errorResponse('Project tidak ditemukan'));
        }
        res.json(successResponse(updatedProject, 'Project berhasil diupdate'));
    }
    catch (err) {
        console.error('Error PATCH /projects:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// DELETE /projects
export const deleteProject = async (req, res) => {
    try {
        const id = String(req.params.id);
        const deletedProject = await projectService.deleteProjectById(id);
        if (!deletedProject) {
            return res.status(404).json(errorResponse('Project tidak ditemukan'));
        }
        res.json(successResponse(deletedProject, 'Project berhasil dihapus'));
    }
    catch (err) {
        console.error('Error DELETE /projects:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
