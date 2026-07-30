import pool from '../config/database.js';
export const findAllTasks = async () => {
    let query = 'SELECT * FROM tasks';
    query += ' ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
};
export const findTaskById = async (id) => {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
};
export const insertTask = async (data) => {
    const { title, description, project_id, status, priority, deadline } = data;
    const query = `
    INSERT INTO tasks (title, description, project_id, status, priority, deadline)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
    const result = await pool.query(query, [
        title,
        description,
        project_id,
        status,
        priority,
        deadline,
    ]);
    return result.rows[0];
};
export const updateTaskStatusById = async (id, data) => {
    const { title, description, project_id, status, priority, deadline } = data;
    // Koma sebelum WHERE sudah dihapus
    const query = `
    UPDATE tasks
    SET title = $1, description = $2, project_id = $3, status = $4, priority = $5, deadline = $6, updated_at = NOW() 
    WHERE id = $7
    RETURNING *
  `;
    const result = await pool.query(query, [
        title,
        description,
        project_id,
        status,
        priority,
        deadline,
        id
    ]);
    return result.rows[0] || null;
};
export const deleteTaskById = async (id) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
};
