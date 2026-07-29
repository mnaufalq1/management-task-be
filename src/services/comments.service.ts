import pool from "../config/database.js";

export const findAllComments = async () => {
  const result = await pool.query("SELECT * FROM comments ORDER BY id ASC");
  return result.rows;
};

export const findCommentById = async (id: string) => {
  const result = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const insertComment = async (data: {
  comment: string;
  task_id: string;
  user_id: string;
}) => {
  const { comment, task_id, user_id } = data;
  const query = `
    INSERT INTO comments (comment, task_id, user_id, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [comment, task_id, user_id]);
  return result.rows[0];
};

export const updateCommentById = async (id: string, data: {
  comment: string;
}) => {
  const { comment } = data;
  const query = `
    UPDATE comments
    SET comment = $1
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [comment, id]);
  return result.rows[0] || null;
};

export const deleteCommentById = async (id: string) => {
  const result = await pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
};