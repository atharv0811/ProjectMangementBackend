import { Request, Response } from "express";
import { Project, Team, User } from "../models";
import { sequelize } from "../utils/db";

export const createProject = async (req: Request, res: Response) => {
    try {
        const { project } = req.body;

        if (
            !project ||
            !project.name ||
            !project.description ||
            !project.project_owner ||
            !project.start_date ||
            !project.end_date ||
            !project.project_team ||
            !project.priority
        ) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        const isOwnerExist = await User.findByPk(project.project_owner);

        if (!isOwnerExist) {
            return res.status(400).json({
                success: false,
                error: "Owner must exist",
            });
        }

        const isTeamExist = await Team.findByPk(project.project_team);

        if (!isTeamExist) {
            return res.status(400).json({
                success: false,
                error: "Team must exist",
            });
        }

        const newProject = await Project.create({
            name: project.name,
            description: project.description,
            project_owner: project.project_owner,
            start_date: project.start_date,
            end_date: project.end_date,
            project_team: project.project_team,
            priority: project.priority,
            status: "active",
        });

        return res.status(201).json({
            success: true,
            project: newProject,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.findAll({
            attributes: {
                include: [
                    [sequelize.col("team.name"), "project_team_name"],
                    [
                        sequelize.literal(`"user"."firstname" || ' ' || "user"."lastname"`),
                        "project_owner_name",
                    ],
                ],
            },
            include: [
                {
                    model: Team,
                    as: "team",
                    // attributes: [],
                },
                {
                    model: User,
                    as: "user",
                    attributes: [],
                },
            ],
        });
        return res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
