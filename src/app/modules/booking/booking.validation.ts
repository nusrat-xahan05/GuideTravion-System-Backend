import { z } from "zod";


export const createBookingSchema = z.object({
    tourId: z.string().min(1, "Tour is required"),
    startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
    endDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
    persons: z.preprocess((v) => Number(v), z.number().min(1, "At least one person required")),
    // guestCount: z.number().int().positive()
    meetingTime: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropoffLocation: z.string().optional(),
    notes: z.string().optional(),
});

export const bookingQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
    touristId: z.string().optional(),
    guideId: z.string().optional(),
    tourId: z.string().optional(),
    date: z.string().optional()
});


// export const updateBookingStatusZodSchema = z.object({
//     status: z.enum(Object.values(TBookingStatus) as [string]),
// });

