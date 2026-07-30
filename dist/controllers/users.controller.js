import { errorResponse, successResponse } from '../helpers/response';
import * as userService from '../services/users.service';
// GET /users - Ambil semua user
export const getUsers = async (req, res) => {
    try {
        const users = await userService.findAllUsers();
        res.json(successResponse(users));
    }
    catch (err) {
        console.error('Error GET /users:', err);
        res.status(500).json(errorResponse('Gagal mengambil data user'));
    }
};
// GET /users/:id - Ambil detail user berdasarkan ID
export const getUserById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!id) {
            res.status(400).json(errorResponse('ID harus ada'));
            return;
        }
        const user = await userService.findUserById(id);
        if (!user) {
            res.status(404).json(errorResponse('User tidak ditemukan'));
            return;
        }
        res.json(successResponse(user));
    }
    catch (err) {
        console.error('Error GET /users/:id:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// POST /users - Buat user baru
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json(errorResponse('Name, email, and password wajib diisi'));
            return;
        }
        const newUser = await userService.insertUser(req.body);
        res.status(201).json(successResponse(newUser, 'User berhasil dibuat'));
    }
    catch (err) {
        console.error('Error POST /users:', err);
        if (err.code === '23505') { // Unique violation
            res.status(400).json(errorResponse('Email sudah terdaftar'));
            return;
        }
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// PATCH /users/:id - Update parsial data user
export const updateUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!id) {
            res.status(400).json(errorResponse('ID harus ada'));
            return;
        }
        const { name, email, password, role } = req.body;
        // Cek apakah ada setidaknya satu data yang dikirim untuk di-update
        if (name === undefined && email === undefined && password === undefined && role === undefined) {
            res.status(400).json(errorResponse('Setidaknya kirimkan name, email, password, atau role untuk di-update'));
            return;
        }
        const updatedUser = await userService.updateUserById(id, req.body);
        if (!updatedUser) {
            res.status(404).json(errorResponse('User tidak ditemukan'));
            return;
        }
        res.json(successResponse(updatedUser, 'User berhasil diperbarui'));
    }
    catch (err) {
        console.error('Error PATCH /users/:id:', err);
        if (err.code === '23505') {
            res.status(400).json(errorResponse('Email sudah digunakan oleh user lain'));
            return;
        }
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
// DELETE /users/:id - Hapus user
export const deleteUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!id) {
            res.status(400).json(errorResponse('ID harus ada'));
            return;
        }
        const deletedUser = await userService.deleteUserById(id);
        if (!deletedUser) {
            res.status(404).json(errorResponse('User tidak ditemukan'));
            return;
        }
        res.json(successResponse(deletedUser, 'User berhasil dihapus'));
    }
    catch (err) {
        console.error('Error DELETE /users/:id:', err);
        res.status(500).json(errorResponse('Terjadi kesalahan di server'));
    }
};
