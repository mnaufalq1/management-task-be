import { Router } from "express";
import {
  getProjectMembers,
  getProjectMemberById,
  createProjectMember,
  updateProjectMember,
  deleteProjectMember,
} from "../controllers/project_members.controller";

const router = Router();

router.get("/", getProjectMembers);
router.get("/:id", getProjectMemberById);
router.post("/", createProjectMember);
router.patch("/:id", updateProjectMember);
router.delete("/:id", deleteProjectMember);

export default router;
