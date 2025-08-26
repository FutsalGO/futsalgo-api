import Joi from "joi";

export const createBookingSchema = Joi.object({
    field_id: Joi.number().integer().required(),
    customer_name: Joi.string().min(3).max(100).required(),
    customer_phone: Joi.string()
        .pattern(/^(?:\+62|62|0)[0-9]{9,15}$/)
        .required(),
    booking_date: Joi.date().iso().required(),
    start_time: Joi.string()
        .pattern(
            /^(?:([01]\d|2[0-3]):[0-5]\d:[0-5]\d|24:00:00)$/,
            "HH:MM:SS format"
        )
        .required(),
    end_time: Joi.string()
        .pattern(
            /^(?:([01]\d|2[0-3]):[0-5]\d:[0-5]\d|24:00:00)$/,
            "HH:MM:SS format"
        )
        .required(),
});

export const updateBookingSchema = Joi.object({
    booking_id: Joi.number().integer().required(),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'rejected').required(),
});