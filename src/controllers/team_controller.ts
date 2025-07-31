import { Request, Response } from "express";
import { Team, User } from "../models";

export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const teams = await Team.findAll({
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: { exclude: ["password"] },
                    through: { attributes: [] },
                },
            ],
        });

        return res.status(200).json(teams);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const createTeam = async (req: Request, res: Response) => {
    try {
        const { name, team_lead, members } = req.body;

        console.log(members);

        const leader = await User.findByPk(team_lead);

        if (!leader) {
            return res.status(400).json({
                success: false,
                error: "Team lead not found",
            });
        }

        const foundMembers = await User.findAll({
            where: {
                id: members,
            },
        });

        if (foundMembers.length !== members.length) {
            return res.status(400).json({
                success: false,
                error: "Some members do not exist",
            });
        }

        const team = await Team.create({ name, team_lead });

        await team.setMembers(members);

        const populatedTeam = await Team.findByPk(team.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: { exclude: ["password"] },
                    through: { attributes: [] },
                },
            ],
        });

        return res.status(201).json({
            success: true,
            team: populatedTeam,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const editTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, team_lead, members } = req.body;

        const team = await Team.findByPk(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: "Team not found",
            });
        }

        const leader = await User.findByPk(team_lead);
        if (!leader) {
            return res.status(400).json({
                success: false,
                error: "Team lead not found",
            });
        }

        const foundMembers = await User.findAll({
            where: {
                id: members,
            },
        });

        if (foundMembers.length !== members.length) {
            return res.status(400).json({
                success: false,
                error: "Some members do not exist",
            });
        }

        await team.update({ name, team_lead });

        await team.setMembers(members);

        const updatedTeam = await Team.findByPk(team.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: { exclude: ["password"] },
                    through: { attributes: [] },
                },
            ],
        });

        return res.status(200).json({
            success: true,
            team: updatedTeam,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const team = await Team.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: { exclude: ["password"] },
                    through: { attributes: [] },
                },
            ],
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: "Team not found",
            });
        }

        if (team.setMembers) {
            await team.setMembers([]);
        }

        await team.destroy();

        return res.status(200).json({
            success: true,
            message: "Team deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
