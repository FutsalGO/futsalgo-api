import { RequestHandler } from "express";
import { verifyToken } from "@/utils/jwt";

export const auth: RequestHandler = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
        if (!token) {
            res.status(401).json({
                code: 401,
                status: 'error',
                message: 'Unauthorized',
                data: null,
            });
            return;
        };

        const decoded = verifyToken(token);
        (req as any).user = decoded;
        next();
    } catch {
        res.status(401).json({
            code: 401,
            status: 'error',
            message: 'Unauthorized',
            data: null,
        });
    }
};