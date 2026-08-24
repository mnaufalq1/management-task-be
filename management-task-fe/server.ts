import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const EXTERNAL_BE_URL = "https://management-task-be-fxgb.vercel.app";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES CONNECTED TO EXTERNAL VERCEL BACKEND ---

  // Health check
  app.get("/api/health", async (_req, res) => {
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/`);
      const data = await response.json();
      res.json({ status: "ok", externalBackend: data });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // Auth: Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: password || "password123" }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errData.message || "Email atau password salah",
        });
      }

      const data = await response.json();
      const rawUser = data.user || data.data || {};
      const formattedUser = {
        id: rawUser.id || `usr_${Date.now()}`,
        email: rawUser.email || email,
        name: rawUser.name || email.split("@")[0],
        teamName: "Tim Management Task",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rawUser.email || email)}`,
      };

      res.json({ success: true, user: formattedUser });
    } catch (err: any) {
      console.error("Login proxy error:", err);
      // Fallback response for offline resilience
      res.json({
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          email,
          name: email.split("@")[0],
          teamName: "Tim Management Task",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        },
      });
    }
  });

  // Auth: Register
  app.post("/api/auth/register", async (req, res) => {
    const { email, name, password, teamName } = req.body;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Pengguna",
          email,
          password: password || "Password123!",
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errData.message || "Gagal mendaftar di server backend",
        });
      }

      const data = await response.json();
      const rawUser = data.data || data.user || {};
      const formattedUser = {
        id: rawUser.id || `usr_${Date.now()}`,
        email: rawUser.email || email,
        name: rawUser.name || name || "Pengguna Baru",
        teamName: teamName || "Tim Management Task",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };

      res.json({ success: true, user: formattedUser });
    } catch (err: any) {
      console.error("Register proxy error:", err);
      res.json({
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          email,
          name: name || "Pengguna Baru",
          teamName: teamName || "Tim Management Task",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        },
      });
    }
  });

  // Projects: GET
  app.get("/api/projects", async (req, res) => {
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/projects`);
      const result = await response.json();
      const list = Array.isArray(result.data) ? result.data : [];

      const formattedProjects = list.map((p: any) => ({
        id: p.id,
        userId: p.user_id || "",
        name: p.project_name || p.name || "Untitled Project",
        description: p.description || "",
        category: p.status || "General",
        color: "#7A1C28",
        createdAt: p.created_at || new Date().toISOString(),
        updatedAt: p.updated_at || new Date().toISOString(),
      }));

      res.json(formattedProjects);
    } catch (err: any) {
      console.error("Get projects proxy error:", err);
      res.json([]);
    }
  });

  // Projects: POST
  app.post("/api/projects", async (req, res) => {
    const { userId, name, description, category } = req.body;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: name,
          description: description || "",
          status: category || "active",
        }),
      });

      const result = await response.json();
      const p = result.data || {};

      const newProj = {
        id: p.id || `proj_${Date.now()}`,
        userId: userId || p.user_id || "",
        name: p.project_name || name,
        description: p.description || description || "",
        category: p.status || category || "General",
        color: "#7A1C28",
        createdAt: p.created_at || new Date().toISOString(),
        updatedAt: p.updated_at || new Date().toISOString(),
      };

      res.status(201).json(newProj);
    } catch (err: any) {
      console.error("Create project proxy error:", err);
      res.status(500).json({ error: "Gagal membuat project" });
    }
  });

  // Projects: PUT / PATCH
  app.put("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, category } = req.body;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: name,
          description: description || "",
          status: category || "active",
        }),
      });

      const result = await response.json();
      const p = result.data || {};

      res.json({
        id: p.id || id,
        name: p.project_name || name,
        description: p.description || description,
        category: p.status || category,
        updatedAt: p.updated_at || new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Update project proxy error:", err);
      res.status(500).json({ error: "Gagal memperbarui project" });
    }
  });

  // Projects: DELETE
  app.delete("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/projects/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      res.json({ success: true, ...data });
    } catch (err: any) {
      console.error("Delete project proxy error:", err);
      res.json({ success: true });
    }
  });

  // Tasks: GET
  app.get("/api/tasks", async (req, res) => {
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/tasks`);
      const result = await response.json();
      const list = Array.isArray(result.data) ? result.data : [];

      const formattedTasks = list.map((t: any) => {
        let status = "To Do";
        const s = (t.status || "").toLowerCase();
        if (s === "completed" || s === "done") status = "Completed";
        else if (s === "in_progress" || s === "in progress") status = "In Progress";

        let priority = "Medium";
        const p = (t.priority || "").toLowerCase();
        if (p === "high") priority = "High";
        else if (p === "low") priority = "Low";

        return {
          id: t.id,
          projectId: t.project_id || "",
          title: t.title || "Untitled Task",
          description: t.description || "",
          status,
          priority,
          deadline: t.deadline ? t.deadline.split("T")[0] : new Date().toISOString().split("T")[0],
          assignedTo: t.assigned_to || "Anggota Tim",
          createdAt: t.created_at || new Date().toISOString(),
          updatedAt: t.updated_at || new Date().toISOString(),
          commentCount: 0,
        };
      });

      res.json(formattedTasks);
    } catch (err: any) {
      console.error("Get tasks proxy error:", err);
      res.json([]);
    }
  });

  // Tasks: POST
  app.post("/api/tasks", async (req, res) => {
    const { projectId, title, description, status, priority, deadline, assignedTo } = req.body;
    try {
      let beStatus = "todo";
      if (status === "Completed") beStatus = "completed";
      else if (status === "In Progress") beStatus = "in_progress";

      const response = await fetch(`${EXTERNAL_BE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || "",
          project_id: projectId,
          status: beStatus,
          priority: (priority || "medium").toLowerCase(),
          deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
        }),
      });

      const result = await response.json();
      const t = result.data || {};

      const newTask = {
        id: t.id || `task_${Date.now()}`,
        projectId: t.project_id || projectId,
        title: t.title || title,
        description: t.description || description || "",
        status: status || "To Do",
        priority: priority || "Medium",
        deadline: deadline || new Date().toISOString().split("T")[0],
        assignedTo: assignedTo || "Anggota Tim",
        createdAt: t.created_at || new Date().toISOString(),
        updatedAt: t.updated_at || new Date().toISOString(),
        commentCount: 0,
      };

      res.status(201).json(newTask);
    } catch (err: any) {
      console.error("Create task proxy error:", err);
      res.status(500).json({ error: "Gagal membuat task" });
    }
  });

  // Tasks: PUT / PATCH
  app.put("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, deadline, projectId, assignedTo } = req.body;
    try {
      let beStatus = "todo";
      if (status === "Completed") beStatus = "completed";
      else if (status === "In Progress") beStatus = "in_progress";

      const response = await fetch(`${EXTERNAL_BE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || "",
          project_id: projectId || "1",
          status: beStatus,
          priority: (priority || "medium").toLowerCase(),
          deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
        }),
      });

      const result = await response.json();
      const t = result.data || {};

      res.json({
        id: t.id || id,
        projectId: t.project_id || projectId,
        title: t.title || title,
        description: t.description || description,
        status: status || "To Do",
        priority: priority || "Medium",
        deadline: deadline || new Date().toISOString().split("T")[0],
        assignedTo: assignedTo || "Anggota Tim",
        updatedAt: t.updated_at || new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Update task proxy error:", err);
      res.status(500).json({ error: "Gagal memperbarui task" });
    }
  });

  // Tasks: DELETE
  app.delete("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      res.json({ success: true, ...data });
    } catch (err: any) {
      console.error("Delete task proxy error:", err);
      res.json({ success: true });
    }
  });

  // Comments: GET
  app.get("/api/tasks/:taskId/comments", async (req, res) => {
    const { taskId } = req.params;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/comments`);
      const result = await response.json();
      const list = Array.isArray(result.data) ? result.data : [];

      let userMap: Record<string, any> = {};
      try {
        const uRes = await fetch(`${EXTERNAL_BE_URL}/users`);
        const uData = await uRes.json();
        if (Array.isArray(uData.data)) {
          uData.data.forEach((u: any) => {
            userMap[u.id] = u;
          });
        }
      } catch (e) {
        // ignore
      }

      const filtered = list.filter((c: any) => String(c.task_id) === String(taskId));
      const formattedComments = filtered.map((c: any) => {
        const u = userMap[c.user_id] || {};
        return {
          id: c.id,
          taskId: c.task_id,
          userId: c.user_id || "usr_guest",
          userName: u.name || "Anggota Tim",
          userTeam: "MataApp Team",
          userAvatar: u.email ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}` : undefined,
          content: c.comment || "",
          createdAt: c.created_at || new Date().toISOString(),
        };
      });

      res.json(formattedComments);
    } catch (err: any) {
      console.error("Get comments proxy error:", err);
      res.json([]);
    }
  });

  // Users: GET
  app.get("/api/users", async (_req, res) => {
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/users`);
      const result = await response.json();
      const list = Array.isArray(result.data) ? result.data : [];
      const formatted = list.map((u: any) => ({
        id: u.id,
        email: u.email || "",
        name: u.name || "Member",
        role: u.role || "member",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email || u.name || "member")}`,
      }));
      res.json(formatted);
    } catch (err: any) {
      console.error("Get users proxy error:", err);
      res.json([]);
    }
  });

  // Project Members: GET
  app.get("/api/project_members", async (req, res) => {
    const projectId = req.query.project_id as string;
    try {
      let url = `${EXTERNAL_BE_URL}/project_members`;
      if (projectId) {
        url += `?project_id=${encodeURIComponent(projectId)}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      const list = Array.isArray(result.data) ? result.data : [];

      // Fetch users list to map names to member IDs
      let userMap: Record<string, any> = {};
      try {
        const uRes = await fetch(`${EXTERNAL_BE_URL}/users`);
        const uData = await uRes.json();
        if (Array.isArray(uData.data)) {
          uData.data.forEach((u: any) => {
            userMap[u.id] = u;
          });
        }
      } catch (e) {
        // ignore error
      }

      const formatted = list.map((m: any) => {
        const u = userMap[m.user_id] || {};
        return {
          id: m.id,
          projectId: m.project_id,
          userId: m.user_id,
          userName: u.name || "Member Tim",
          userEmail: u.email || "",
          userRole: u.role || "member",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email || m.user_id || "member")}`,
          createdAt: m.created_at || new Date().toISOString(),
        };
      });

      res.json(formatted);
    } catch (err: any) {
      console.error("Get project_members proxy error:", err);
      res.json([]);
    }
  });

  // Project Members: POST
  app.post("/api/project_members", async (req, res) => {
    const { projectId, userId } = req.body;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/project_members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          user_id: userId,
        }),
      });

      const result = await response.json();
      const m = result.data || {};

      res.status(201).json({
        id: m.id || `pm_${Date.now()}`,
        projectId: m.project_id || projectId,
        userId: m.user_id || userId,
        createdAt: m.created_at || new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Create project_member proxy error:", err);
      res.status(500).json({ error: "Gagal menambahkan member ke project" });
    }
  });

  // Project Members: DELETE
  app.delete("/api/project_members/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/project_members/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      res.json({ success: true, ...data });
    } catch (err: any) {
      console.error("Delete project_member proxy error:", err);
      res.json({ success: true });
    }
  });

  // Comments: DELETE
  app.delete("/api/comments/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/comments/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      res.json({ success: true, ...data });
    } catch (err: any) {
      console.error("Delete comment proxy error:", err);
      res.json({ success: true });
    }
  });
  app.post("/api/tasks/:taskId/comments", async (req, res) => {
    const { taskId } = req.params;
    const { userId, userName, userTeam, content } = req.body;
    try {
      const response = await fetch(`${EXTERNAL_BE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: content,
          task_id: taskId,
          user_id: userId || "1",
        }),
      });

      const result = await response.json();
      const c = result.data || {};

      const newComment = {
        id: c.id || `comm_${Date.now()}`,
        taskId,
        userId: userId || c.user_id || "usr_guest",
        userName: userName || "Anggota Tim",
        userTeam: userTeam || "Tim MataApp",
        content: c.comment || content,
        createdAt: c.created_at || new Date().toISOString(),
      };

      res.status(201).json(newComment);
    } catch (err: any) {
      console.error("Create comment proxy error:", err);
      res.status(500).json({ error: "Gagal membuat komentar" });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server MataApp running on http://0.0.0.0:${PORT} connected to ${EXTERNAL_BE_URL}`);
  });
}

startServer();
