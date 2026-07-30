import { successResponse, errorResponse } from '../helpers/response';
import * as commentService from '../services/comments.service';
// GET /comments
export const getComments = async (req, res) => {
    try {
        const comments = await commentService.findAllComments();
        res.json(successResponse(comments));
    }
    catch (err) {
        console.error('Error GET /comments:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// GET /comments/:id
export const getCommentById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const comment = await commentService.findCommentById(id);
        if (!comment) {
            return res.status(404).json(errorResponse('Komentar tidak ditemukan'));
        }
        res.json(successResponse(comment));
    }
    catch (err) {
        console.error('Error GET /comments/:id:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// POST /comments
export const createComment = async (req, res) => {
    try {
        const { comment, task_id, user_id } = req.body;
        if (!comment || !task_id || !user_id) {
            return res.status(400).json(errorResponse('Semua field wajib diisi'));
        }
        const newComment = await commentService.insertComment(req.body);
        res.status(201).json(successResponse(newComment, 'Komentar berhasil ditambahkan'));
    }
    catch (err) {
        console.error('Error POST /comments:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// PATCH /comments/:id
export const updateComment = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json(errorResponse('Teks komentar wajib diisi'));
        }
        const updatedComment = await commentService.updateCommentById(id, req.body);
        if (!updatedComment) {
            return res.status(404).json(errorResponse('Komentar tidak ditemukan'));
        }
        res.json(successResponse(updatedComment, 'Komentar berhasil diperbarui'));
    }
    catch (err) {
        console.error('Error PATCH /comments:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// DELETE /comments/:id
export const deleteComment = async (req, res) => {
    try {
        const id = String(req.params.id);
        const deletedComment = await commentService.deleteCommentById(id);
        if (!deletedComment) {
            return res.status(404).json(errorResponse('Komentar tidak ditemukan'));
        }
        res.json(successResponse(deletedComment, 'Komentar berhasil dihapus'));
    }
    catch (err) {
        console.error('Error DELETE /comments:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
