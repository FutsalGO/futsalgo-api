import { Request, Response, NextFunction } from "express";
import { getAllFieldsService } from "@/services/fields-service";

export async function getAllFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order: "asc" | "desc" = req.query.order === "desc" ? "desc" : "asc";
    const sortBy =
      req.query.sortBy === "weekend_price" ? "weekend_price" : "weekday_price";

    const normalized = await getAllFieldsService(order, sortBy);
    
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
