import { Router } from "express";
import { createUser, currentUser, getAllUsers, getUserById, updateUser } from "../controllers/user_controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middleware/auth";

const user_router = Router();

user_router.post('/users', authenticate, asyncHandler(createUser))
user_router.get('/users', authenticate, asyncHandler(getAllUsers))
user_router.get('/users/:id', authenticate, asyncHandler(getUserById))
user_router.put('/users/:id', authenticate, asyncHandler(updateUser))
user_router.get('/get_user_detail', authenticate, asyncHandler(currentUser))

export default user_router;