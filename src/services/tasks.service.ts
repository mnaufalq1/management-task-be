import pool from '../config/database';

export const findAllTasks = async () => {
  let query = 'SELECT * FROM tasks';
  query += ' ORDER BY id ASC';
  const result = await pool.query(query);
  return result.rows;
};

export const findTaskById = async (id: string) => {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const insertTask = async (data: {
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
}) => {
  const { title, description, status, priority, deadline } = data;
  const query = `
    INSERT INTO tasks (title, description, status, priority, deadline)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(query, [
    title,
    description,
    status,
    priority,
    deadline,
  ]);
  return result.rows[0];
};

export const updateTaskStatusById = async (id: string) => {
  const query = `
    UPDATE tasks
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const deleteTaskById = async (id: string) => {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
};