import c from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || '';

if (CORS_ORIGINS.length === 0) {
    throw new Error("CORS_ORIGINS is not defined in the environment variables");
}

export const cors = c({
    origin: CORS_ORIGINS,
    credentials: true
});