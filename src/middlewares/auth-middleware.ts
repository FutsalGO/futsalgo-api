import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt"; // pastikan ini mengembalikan payload token yang sudah didecode

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.auth_token; // Ambil dari cookie, bukan header

  if (!token) {
    return res.status(401).json({
      code: 401,
      status: "unauthorized",
      message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
    });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      status: "unauthorized",
      message: "Token tidak valid atau telah kedaluwarsa.",
    });
  }
}
