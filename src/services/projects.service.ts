import pool from "../config/database.js";

// GET /projects - Ambil semua project
export const findAllProjects = async () => {
    const query = 'SELECT * FROM projects ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
}

// GET /projects/:id - Ambil detail project
export const findProjectById = async (id: string) => {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0] || null;
}

// POST /projects - Buat project baru
export const insertProject = async (data: {
    project_name: string;
    description?: string;
    user_id: string;
    status?: string;
}) => {
    const { project_name, description, user_id, status } = data;
    const query = `
        INSERT INTO projects (project_name, description, user_id, status, created_at, updated_at)
        VALUES ($1, $2, $3, COALESCE($4, 'pending'), NOW(), NOW())
        RETURNING *
    `;
    const result = await pool.query(query, [project_name, description, user_id, status]);
    return result.rows[0];
}

// PATCH /projects/:id - Update parsial data project
export const updateProjectById = async (id: string, data: {
    project_name?: string;
    description?: string;
    user_id: string;
    status?: string;
}) => {
    const { project_name, description, user_id, status } = data;
    const query = `
        UPDATE projects
        SET project_name = COALESCE($1, project_name),
            description = COALESCE($2, description),
            user_id = COALESCE($3, user_id),
            status = COALESCE($4, status),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
    `;
    const result = await pool.query(query, [project_name, description, user_id, status, id]);
    return result.rows[0] || null;
}

// DELETE /projects/:id - Hapus project
export const deleteProjectById = async (id: string) => {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
}