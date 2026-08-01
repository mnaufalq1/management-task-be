import { successResponse, errorResponse } from '../helpers/response.js';
import * as taskService from '../services/tasks.service.js';
// GET /tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.findAllTasks();
        res.json(successResponse(tasks));
    }
    catch (err) {
        console.error('Error GET /tasks:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// GET /tasks/:id
export const getTaskById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const task = await taskService.findTaskById(id);
        if (!task) {
            return res.status(404).json(errorResponse('Task tidak ditemukan'));
        }
        res.json(successResponse(task));
    }
    catch (err) {
        console.error('Error GET /tasks/:id:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// POST /tasks
export const createTask = async (req, res) => {
    try {
        const { title, description, project_id, status, priority, deadline } = req.body;
        if (!title || !description || !project_id || !status || !priority || !deadline) {
            return res.status(400).json(errorResponse('Semua field wajib diisi'));
        }
        const newTask = await taskService.insertTask(req.body);
        res.status(201).json(successResponse(newTask, 'Task berhasil dibuat'));
    }
    catch (err) {
        console.error('Error POST /tasks:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// PATCH /tasks/:id
export const updateTaskStatus = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { title, description, project_id, status, priority, deadline } = req.body;
        if (!title || !description || !project_id || !status || !priority || !deadline) {
            return res.status(400).json(errorResponse('Semua field wajib diisi'));
        }
        const updatedTask = await taskService.updateTaskStatusById(id, req.body);
        if (!updatedTask) {
            return res.status(404).json(errorResponse('Task tidak ditemukan'));
        }
        res.json(successResponse(updatedTask, 'Status task berhasil diperbarui'));
    }
    catch (err) {
        console.error('Error PATCH /tasks/:id:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// DELETE /tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const id = String(req.params.id);
        const deletedTask = await taskService.deleteTaskById(id);
        if (!deletedTask) {
            return res.status(404).json(errorResponse('Task tidak ditemukan'));
        }
        res.json(successResponse(deletedTask, 'Task berhasil dihapus'));
    }
    catch (err) {
        console.error('Error DELETE /tasks/:id:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
