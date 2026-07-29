import pool from "../config/database";

export const findAllProjectMembers = async (
  projectId?: string,
  userId?: string
) => {
  let query = "SELECT * FROM project_members";
  const params: any[] = [];
  const conditions: string[] = [];

  if (projectId) {
    params.push(projectId);
    conditions.push(`project_id = $${params.length}`);
  }

  if (userId) {
    params.push(userId);
    conditions.push(`user_id = $${params.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY id ASC";

  const result = await pool.query(query, params);
  return result.rows;
};

export const findProjectMemberById = async (id: string) => {
  const result = await pool.query(
    "SELECT * FROM project_members WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const insertProjectMember = async (data: {
  project_id: number | string;
  user_id: number | string;
}) => {
  const { project_id, user_id } = data;
  const query = `
    INSERT INTO project_members (project_id, user_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(query, [project_id, user_id]);
  return result.rows[0];
};

export const updateProjectMemberById = async (
  id: string,
  data: { project_id?: number | string; user_id?: number | string }
) => {
  const existingMember = await findProjectMemberById(id);
  if (!existingMember) return null;

  const updatedProjectId =
    data.project_id !== undefined ? data.project_id : existingMember.project_id;
  const updatedUserId =
    data.user_id !== undefined ? data.user_id : existingMember.user_id;

  const query = `
    UPDATE project_members
    SET project_id = $1, user_id = $2
    WHERE id = $3
    RETURNING *
  `;
  const result = await pool.query(query, [
    updatedProjectId,
    updatedUserId,
    id,
  ]);
  return result.rows[0];
};

export const deleteProjectMemberById = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM project_members WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
};