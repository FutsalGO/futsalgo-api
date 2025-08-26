import prisma from '@/prisma/client';
import { createBookingSchema, updateBookingSchema } from '@/validations/admin/booking-validation';

interface BookingFilters {
    limit?: number;
    offset?: number;
    date?: string;
    status?: string;
}

interface CreateBookingData {
    field_id: number;
    customer_name: string;
    customer_phone: string;
    booking_date: string;
    start_time: string;
    end_time: string;
}

interface UpdateBookingData {
    booking_id: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
}

export async function getBookings(filters: BookingFilters) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                ...(filters.date ? { booking_date: new Date(filters.date).toISOString() } : {}),
                ...(filters.status ? { status: filters.status } : {}),
            },
            take: Number(filters.limit) || 10,
            skip: Number(filters.offset) || 0,
            orderBy: {
                id: 'desc',
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

        const newBooking = await prisma.booking.create({
            data: {
                field_id: value.field_id,
                customer_name: value.customer_name,
                customer_phone: value.customer_phone,
                booking_date: new Date(value.booking_date).toISOString(),
                start_time: new Date(`1970-01-01T${value.start_time}Z`).toISOString(),
                end_time: new Date(`1970-01-01T${value.end_time}Z`).toISOString(),
                status: 'pending',
            },
        });

        return newBooking;
    } catch (error) {
        throw error;
    }
}

export async function updateBooking(data: UpdateBookingData) {
    try {
        const { error, value } = updateBookingSchema.validate(data);
        if (error) {
            throw { code: 400, message: error.message };
        }

        const newBooking = await prisma.booking.update({
            where: { id: value.booking_id },
            data: {
                status: value.status,
            },
        });

        return newBooking;
    } catch (error) {
        throw error;
    }
}

export async function deleteBooking(booking_id: number) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: booking_id },
        });
        if (!booking) throw { code: 404, message: "Booking tidak ditemukan." };

        const today = new Date();
        const bookingDate = new Date(booking.created_at);
        const diffInTime = today.getTime() - bookingDate.getTime();
        const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

        if (diffInDays < 7) {
            await prisma.booking.update({
                where: { id: booking_id },
                data: { status: 'cancelled' },
            });
        }
        else {
            await prisma.booking.delete({
                where: { id: booking_id },
            });
        }

        return true
    } catch (error) {
        throw error;
    }
}
