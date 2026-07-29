import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/database";
import userRoutes from "./routes/users.routes";
import projectRoutes from "./routes/projects.routes";
import { createClient } from "@supabase/supabase-js";
import commentsRoutes from "./routes/comments.routes";
import tasksRoutes from "./routes/tasks.routes";
import projectMembersRouter from "./routes/project_members.routes";
import authRoutes from "./routes/auth.routes";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : undefined;

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", tasksRoutes);
app.use("/comments", commentsRoutes);
app.use("/project_members", projectMembersRouter);
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Halo, Ini adalah API Management Task",
    version: "1.0.0",
  });
});

app.get("/test", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});