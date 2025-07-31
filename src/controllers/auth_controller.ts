import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../models";
import { Op } from "sequelize";

export const register = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;

        if (
            !user ||
            !user.firstname ||
            !user.lastname ||
            !user.email ||
            !user.mobile ||
            !user.password
        ) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        const isUserExist = await User.findOne({
            where: {
                [Op.or]: [
                    { email: user.email },
                    { mobile: user.mobile }
                ]
            }
        });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                error: "User already exist with email or mobile",
            });
        }

        const hashedPassword = await hash(user.password, 10);

        const newUser = await User.create({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
            password: hashedPassword,
        });

        const { password, ...safeUser } = newUser.toJSON();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
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

export const login = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;

        if (!user || !user.email || !user.password) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        const existUser = await User.findOne({
            where: {
                email: user.email,
            },
            attributes: ["id", "email", "password"],
        });

        if (!existUser) {
            return res.status(404).json({
                success: false,
                error: "Invalid Email or Password",
            });
        }

        const isValidPassword = await compare(user.password, existUser.password!);

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                error: "Invalid Email or Password",
            });
        }

        const token = sign({ user_id: existUser.id }, process.env.SECRETKEY!, {
            expiresIn: "24h",
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
