import { Request, Response, NextFunction } from "express";
import { getAllFieldsService } from "@/services/fields-service";

export async function getAllFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const normalized = await getAllFieldsService();

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "GET Fields Success",
      count: normalized.length,
      data: normalized,
    });
  } catch (error) {
    next(error);
  }
}
