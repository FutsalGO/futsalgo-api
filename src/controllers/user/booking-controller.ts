import { Request, Response, NextFunction } from "express";
import { createBooking, deleteBooking, getBookings } from "@/services/user/booking-service";

export async function handleGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user_id = (req as any).user?.id;
    const bookings = await getBookings({...req.query, user_id});
    
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function handleCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const booking_data = {
        ...req.body,
        user_id: (req as any).user?.id,
        customer_name: (req as any).user?.name,
        customer_phone: (req as any).user?.phone,
    };
    const new_booking = await createBooking(booking_data);

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Booking created successfully",
      data: new_booking,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function handleDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const booking_id = Number(req.params.id);
    if (isNaN(booking_id)) {
      throw {
        code: 400,
        status: "error",
        message: "Invalid booking ID",
      };
    }

    const deleted_booking = await deleteBooking(booking_id);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Booking deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}