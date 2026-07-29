import pool from "../config/database";

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
    status?: string;
}) => {
    const { project_name, description, status } = data;
    const query = `
        INSERT INTO projects (project_name, description, status)
        VALUES ($1, $2, COALESCE($3, 'pending'))
        RETURNING *
    `;
    const result = await pool.query(query, [project_name, description, status]);
    return result.rows[0];
}

// PATCH /projects/:id - Update parsial data project
export const updateProjectById = async (id: string, data: {
    project_name?: string;
    description?: string;
    status?: string;
}) => {
    const { project_name, description, status } = data;
    const query = `
        UPDATE projects
        SET project_name = COALESCE($1, project_name),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            updated_at = NOW()
        WHERE id = $4
        RETURNING *
    `;
    const result = await pool.query(query, [project_name, description, status, id]);
    return result.rows[0] || null;
}

// DELETE /projects/:id - Hapus project
export const deleteProjectById = async (id: string) => {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
}