import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createProject, getAllProjects } from "../controllers/project_controller";
import { authenticate } from "../middleware/auth";

const project_router = Router();

project_router.post("/projects", authenticate, asyncHandler(createProject));
project_router.get("/projects", authenticate, asyncHandler(getAllProjects));

export default project_router;