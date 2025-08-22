import { RequestHandler } from "express";
import { signToken, verifyToken } from "../utils/jwt";
import { loginSchema } from "../validations/auth-validation";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";

export const login: RequestHandler = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) throw {
            code: 400,
            message: error.message,
        };

        const user = await prisma.user.findUnique({
            where: {
                email: value.email,
            },
        });
        if(!user) throw {
            code: 404,
            message: 'User not found',
        }

        const isPasswordValid = await bcrypt.compare(value.password, user.password);
        if (!isPasswordValid) throw {
            code: 401,
            message: 'Invalid login',
        };

        const token = signToken(user);

        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Login successful',
            data: {token, user},
        });
    } catch (error) {
        next(error)
    }
}