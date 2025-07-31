import { Request, Response, NextFunction, RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/user_model";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authReq = req as AuthRequest;

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res
                .status(401)
                .json({ success: false, message: "Unauthorized: No token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = verify(token, process.env.SECRETKEY!);

        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found - Authorization failed" });
            return;
        }

        authReq.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res
            .status(401)
            .json({ success: false, message: "Invalid or expired token" });
    }
};
