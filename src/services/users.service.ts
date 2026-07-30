import pool from '../config/database.js';

export const findAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
  return result.rows;
};

export const findUserById = async (id: string) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const insertUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const { name, email, password, role } = data;
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, COALESCE($4, 'member'))
    RETURNING *
  `;
  const result = await pool.query(query, [name, email, password, role]);
  return result.rows[0];
};

export const updateUserById = async (
  id: string,
  data: { name?: string; email?: string; password?: string; role?: string }
) => {
  // Ambil data user lama terlebih dahulu
  const existingUser = await findUserById(id);
  if (!existingUser) return null;

  const updatedName = data.name !== undefined ? data.name : existingUser.name;
  const updatedEmail = data.email !== undefined ? data.email : existingUser.email;
  const updatedPassword = data.password !== undefined ? data.password : existingUser.password;
  const updatedRole = data.role !== undefined ? data.role : existingUser.role;

  const query = `
    UPDATE users
    SET name = $1, email = $2, password = $3, role = $4
    WHERE id = $5
    RETURNING *
  `;
  const result = await pool.query(query, [
    updatedName,
    updatedEmail,
    updatedPassword,
    updatedRole,
    id,
  ]);
  return result.rows[0];
};

export const deleteUserById = async (id: string) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
};