import pool from "../config/database.js";

export const findUserByEmail = async (email: string) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

export const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
}) => {
    const { name, email, password, role } = data;
    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const result = await pool.query(query, [name, email, password, role]);
    return result.rows[0];
};
