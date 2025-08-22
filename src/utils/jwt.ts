import jwt from 'jsonwebtoken';
import { env } from '../config/env';

if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const signToken = (payload: object) => {
    return jwt.sign(payload, env.JWT_SECRET, {expiresIn: '1d'});
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
}