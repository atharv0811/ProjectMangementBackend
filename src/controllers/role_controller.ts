import { Request, Response } from "express";
import { Role } from "../models";

export const createRole = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        const roleExists = await Role.findOne({
            where: {
                title: title
            },
        });

        console.log(roleExists)

        if (roleExists) {
            return res.status(400).json({
                success: false,
                error: "Role already exists",
            });
        }

        await Role.create({ title: title, active: true });

        return res.status(201).json({
            success: true,
            message: "Role created successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}

export const editRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                error: "Role not found",
            });
        }

        await role?.update(req.body)

        return res.status(200).json({
            success: true,
            role,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await Role.destroy({
            where: {
                id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}

export const getAllRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.findAll();
        return res.status(200).json(roles)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}