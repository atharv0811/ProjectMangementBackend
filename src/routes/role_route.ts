import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createRole, deleteRole, editRole, getAllRoles } from "../controllers/role_controller";
import { authenticate } from "../middleware/auth";

const role_router = Router();

role_router.get('/roles', authenticate, asyncHandler(getAllRoles));
role_router.post('/roles', authenticate, asyncHandler(createRole));
role_router.put('/roles/:id', authenticate, asyncHandler(editRole));
role_router.delete('/roles/:id', authenticate, asyncHandler(deleteRole));

export default role_router;