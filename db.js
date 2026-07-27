import dotenv from 'dotenv'
dotenv.config();

import { Pool } from 'pg'

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Wajib untuk koneksi aman SSL ke Supabase
  }
})

export default Pool;