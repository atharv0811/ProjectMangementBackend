import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Role, User } from "../models";
import { Op } from "sequelize";
import { sequelize } from "../utils/db";
import { generateUniqueId } from "../utils/helper";
import { hash } from "bcryptjs";
import { sendMail } from "../utils/sendMail";

// create user
export const createUser = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;

        if (
            !user ||
            !user.firstname ||
            !user.lastname ||
            !user.email ||
            !user.mobile ||
            !user.role_id
        ) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        const roleExists = await Role.findByPk(user.role_id);

        if (!roleExists) {
            return res.status(400).json({
                success: false,
                error: "Invalid role_id: role does not exist",
            });
        }

        const isUserExist = await User.findOne({
            where: {
                [Op.or]: [{ email: user.email }, { mobile: user.mobile }],
            },
        });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                error: "User already exist with email or mobile",
            });
        }

        const generatePassword = generateUniqueId(6);

        const hashedPassword = await hash(generatePassword, 10);

        const newUser = await User.create({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
            role_id: user.role_id,
            type: user.type,
            password: hashedPassword
        });

        const { password, ...safeUser } = newUser.toJSON()

        await sendMail(
            user.email,
            "Your Account Has Been Created",
            `Hello ${user.firstname},\n\nYour account has been created.\nHere is your temporary password: ${generatePassword}\n\nPlease change your password after login.`
        );

        return res.status(200).json({
            success: true,
            user: safeUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

// get current user
export const currentUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {
                include: [[sequelize.col("role.title"), "role_name"]],
            },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: [],
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: {
                include: [[sequelize.col("role.title"), "role_name"]],
            },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: []
                }
            ],
        });

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

// get user by id
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: {
                include: [[sequelize.col("role.title"), "role_name"]],
            },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: [],
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

// update user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const roleExists = await Role.findByPk(req.body.user.role_id);

        if (!roleExists) {
            return res.status(400).json({
                success: false,
                error: "Invalid role_id: role does not exist",
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        await user.update(req.body.user);

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Update user error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
