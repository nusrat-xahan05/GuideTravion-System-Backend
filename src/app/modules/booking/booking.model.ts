import { model, Schema, Types } from "mongoose";
import { IBooking, TBookingStatus, TCancelledBy } from "./booking.interface";
import { TPaymentStatus } from "../payment/payment.interface";


const bookingSchema = new Schema<IBooking>({
    tourId: { type: Types.ObjectId, ref: "Tour", required: true },
    guideId: { type: Types.ObjectId, ref: "Guide", required: true },   // GuideModel uses user id as _id
    touristId: { type: Types.ObjectId, ref: "User", required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    meetingTime: { type: String },
    pickupLocation: { type: String },
    dropoffLocation: { type: String },

    persons: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    platformFee: { type: Number },
    guideEarning: { type: Number },

    paymentStatus: { type: String, enum: Object.values(TPaymentStatus), default: TPaymentStatus.UNPAID },
    paymentId: { type: Types.ObjectId, ref: "Payment" },

    status: { type: String, enum: Object.values(TBookingStatus), default: TBookingStatus.PENDING },
    cancelledBy: { type: String, enum: Object.values(TCancelledBy) },
    expiresAt: { type: Date },
    completedAt: { type: Date, },

    notes: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

// Index for searching bookings by guide + date quickly
bookingSchema.index({ guideId: 1, startDate: 1, endDate: 1, status: 1, });
bookingSchema.index({ tourId: 1, startDate: 1, endDate: 1 });



export const BookingModel = model<IBooking>("Booking", bookingSchema);


