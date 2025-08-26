import { Request, Response, NextFunction } from "express";
import { createBooking, deleteBooking, getBookings, updateBooking } from "@/services/admin/booking-service";

export async function handleGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bookings = await getBookings(req.query);
    
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
    const new_booking = await createBooking(req.body);

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

export async function handleUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const booking_id = Number(req.params.id);
    const new_booking = await updateBooking({...req.body, booking_id});

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