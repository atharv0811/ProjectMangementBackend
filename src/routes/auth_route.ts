import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { login, register } from "../controllers/auth_controller";

const auth_router = Router();

auth_router.post('/register', asyncHandler(register));
auth_router.get('/login', asyncHandler(login))

export default auth_router;