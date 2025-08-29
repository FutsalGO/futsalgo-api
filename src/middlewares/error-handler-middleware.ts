import { Request, Response, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const code = Number(err.code) || 500;
    
    res.status(code).json({
        code,
        status: err.status || 'error',
        message: err.message || 'Internal Server Error',
        data: err.data || null
    });
}