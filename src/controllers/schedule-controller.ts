import { getSchedules } from "@/services/schedule-service";
import { NextFunction, Request, Response } from "express";

export async function handleGetSchedules(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const field_id = Number(req.params.field_id)
    const schedules = await getSchedules(field_id);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Booking Schedules retrieved successfully",
      data: schedules,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}