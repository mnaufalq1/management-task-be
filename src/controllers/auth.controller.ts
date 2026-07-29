import { Request, Response } from "express";
import pool from "../config/database"; // Menggunakan pool PostgreSQL kamu

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      res.status(400).json({ 
        message: "Email dan password wajib diisi!" 
      });
      return;
    }

    // 2. Cari user di tabel public.users berdasarkan email
    const result = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = $1",
      [email]
    );

    // 3. Jika user tidak ditemukan
    if (result.rows.length === 0) {
      res.status(401).json({ 
        message: "Gagal login. Email tidak terdaftar." 
      });
      return;
    }

    const user = result.rows[0];

    // 4. Pencocokan password (pencocokan string biasa)
    if (user.password !== password) {
      res.status(401).json({ 
        message: "Gagal login. Password salah." 
      });
      return;
    }

    // 5. Jika sukses, hapus password dari data respon demi keamanan
    delete user.password;

    res.status(200).json({
      message: "Berhasil masuk!",
      user: user
    });

  } catch (err) {
    console.error("Error pada Login:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validasi input wajib
    if (!name || !email || !password) {
      res.status(400).json({ 
        message: "Nama, email, dan password wajib diisi!" 
      });
      return;
    }

    // 2. Cek apakah email sudah terdaftar di database
    const checkEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (checkEmail.rows.length > 0) {
      res.status(400).json({ 
        message: "Email sudah terdaftar, silakan gunakan email lain." 
      });
      return;
    }

    // 3. Simpan data user baru ke tabel users
    // (role opsional, jika tidak dikirim akan default ke 'developer')
    const userRole = role || "developer";

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, password, userRole]
    );

    // 4. Berikan respon berhasil
    res.status(201).json({
      message: "Pendaftaran berhasil!",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error("Error pada Register:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};