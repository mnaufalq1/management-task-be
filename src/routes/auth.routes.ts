import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

// Endpoint POST /auth/login
router.post("/login", login);

// Endpoint POST /auth/register
router.post("/register", register);

export default router;
