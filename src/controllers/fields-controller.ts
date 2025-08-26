import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma/client";

export async function getAllFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order: "asc" | "desc" = req.query.order === "desc" ? "desc" : "asc";
    const sortBy =
      req.query.sortBy === "weekend_price" ? "weekend_price" : "weekday_price";

    const fields = await prisma.field.findMany({
      orderBy: { [sortBy]: order },
    });

    // Jika schema pakai Decimal, normalisasi ke number untuk response
    const normalized = fields.map((f) => ({
      ...f,
      weekday_price:
        typeof (f as any).weekday_price === "object"
          ? Number((f as any).weekday_price)
          : (f as any).weekday_price,
      weekend_price:
        typeof (f as any).weekend_price === "object"
          ? Number((f as any).weekend_price)
          : (f as any).weekend_price,
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "GET Fields Success",
      order,
      sortBy,
      count: normalized.length,
      data: normalized,
    });
  } catch (error) {
    next(error);
  }
}
