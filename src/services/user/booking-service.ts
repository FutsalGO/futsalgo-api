import prisma from "@/prisma/client";
import { createBookingSchema } from "@/validations/user/booking-validation";
import { create } from "domain";

interface BookingFilters {
  user_id: number;
  limit?: number;
  offset?: number;
  date?: string;
  status?: string;
}

interface CreateBookingData {
  user_id: number;
  field_id: number;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
}

export async function getBookings(filters: BookingFilters) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        user_id: filters.user_id,
        ...(filters.date
          ? { booking_date: new Date(filters.date).toISOString() }
          : {}),
        ...(filters.status ? { status: filters.status } : {}),
        NOT: {
          status: "cancelled",
        },
      },
      take: Number(filters.limit) || 10,
      skip: Number(filters.offset) || 0,
      orderBy: {
        id: "desc",
      },
    });

    return bookings;
  } catch (error) {
    throw error;
  }
}

export async function createBooking(data: CreateBookingData) {
  try {
    const { error, value } = createBookingSchema.validate(data);
    if (error) {
      throw { code: 400, message: error.message };
    }
    // 1️⃣ Cek user_id apakah masih punya booking aktif (status != completed)
    const existingUserBooking = await prisma.booking.findFirst({
      where: {
        user_id: value.user_id,
        status: { not: "completed" },
      },
    });
    if (existingUserBooking) {
      throw {
        code: 400,
        message: "User masih memiliki booking aktif, selesaikan dulu",
      };
    }
    // 2️⃣ Hitung jumlah booking pending di field ini
    const pendingCount = await prisma.booking.count({
      where: {
        field_id: value.field_id,
        status: "pending",
      },
    });

    if (pendingCount >= 5) {
      throw {
        code: 400,
        message: "Lapangan sudah penuh (maksimal 5 booking pending)",
      };
    }

    const newBooking = await prisma.booking.create({
      data: {
        user_id: value.user_id,
        field_id: value.field_id,
        customer_name: value.customer_name,
        customer_phone: value.customer_phone,
        booking_date: new Date(value.booking_date).toISOString(),
        start_time: new Date(`1970-01-01T${value.start_time}Z`).toISOString(),
        end_time: new Date(`1970-01-01T${value.end_time}Z`).toISOString(),
        status: "pending",
      },
    });

    return newBooking;
  } catch (error) {
    throw error;
  }
}

export async function deleteBooking(booking_id: number) {
  try {
    const deleted_booking = await prisma.booking.update({
      where: { id: booking_id },
      data: { status: "cancelled" },
    });

    return deleted_booking;
  } catch (error) {
    throw error;
  }
}
