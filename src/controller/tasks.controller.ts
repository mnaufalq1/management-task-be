import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../helpers/response';
import * as taskService from '../services/tasks.service';

// GET /tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.findAllTasks();
    res.json(successResponse(tasks));
  } catch (err) {
    console.error('Error GET /tasks:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
};

// GET /tasks/:id
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const task = await taskService.findTaskById(id);
    if (!task) {
      return res.status(404).json(errorResponse('Task tidak ditemukan'));
    }

    res.json(successResponse(task));
  } catch (err) {
    console.error('Error GET /tasks/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
};

// POST /tasks
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, deadline } = req.body;

    if (!title || !description || !status || !priority || !deadline) {
      return res.status(400).json(errorResponse('Semua field wajib diisi'));
    }

    const newTask = await taskService.insertTask(req.body);
    res.status(201).json(successResponse(newTask, 'Task berhasil dibuat'));
  } catch (err: any) {
    console.error('Error POST /tasks:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
}; 

// PATCH /tasks/:id
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json(errorResponse('Status wajib diisi'));
    }

    const updatedTask = await taskService.updateTaskStatusById(id);
    if (!updatedTask) {
      return res.status(404).json(errorResponse('Task tidak ditemukan'));
    }

    res.json(successResponse(updatedTask, 'Status task berhasil diperbarui'));
  } catch (err) {
    console.error('Error PATCH /tasks/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
};

// DELETE /tasks/:id
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deletedTask = await taskService.deleteTaskById(id);
    if (!deletedTask) {
      return res.status(404).json(errorResponse('Task tidak ditemukan'));
    }

    res.json(successResponse(deletedTask, 'Task berhasil dihapus'));
  } catch (err) {
    console.error('Error DELETE /tasks/:id:', err);
    res.status(500).json(errorResponse('Terjadi kesalahan di server'));
  }
};