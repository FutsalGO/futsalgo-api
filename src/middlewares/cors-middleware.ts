import c from 'cors';
import { env } from '../config/env';

if (env.CORS_ORIGINS.length === 0) {
    throw new Error("CORS_ORIGINS is not defined in the environment variables");
}

export const cors = c({
    origin: env.CORS_ORIGINS,
    credentials: true
});