import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middleware/auth";
import { createTeam, deleteTeam, editTeam, getAllTeams } from "../controllers/team_controller";

const team_router = Router();

team_router.get('/teams', authenticate, asyncHandler(getAllTeams));
team_router.post('/teams', authenticate, asyncHandler(createTeam));
team_router.put('/teams/:id', authenticate, asyncHandler(editTeam));
team_router.delete('/teams/:id', authenticate, asyncHandler(deleteTeam));

export default team_router;