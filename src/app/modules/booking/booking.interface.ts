// User - Booking(Pending) -> Payment (Unpaid) -> SSLCommerz -> Booking update = confirm -> Payment update = Paid
import { Types } from "mongoose";
import { TPaymentStatus } from "../payment/payment.interface";


export enum TBookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}

export enum TCancelledBy {
    TOURIST = "TOURIST",
    GUIDE = "GUIDE",
    ADMIN = "ADMIN",
    SYSTEM = "SYSTEM", // for auto-expiry
}

export interface IBooking {
    _id?: Types.ObjectId;

    tourId: Types.ObjectId;
    guideId: Types.ObjectId;   // user id that acts as guide (matches GuideModel _id)
    touristId: Types.ObjectId; // user id of tourist

    startDate: Date; // start of booking (date/time)
    endDate: Date;   // end of booking (date/time)         

    meetingTime?: string;      // optional, time of meeting (e.g. "09:30")
    pickupLocation?: string;
    dropoffLocation?: string;

    persons: number;
    totalAmount: number;
    platformFee: number;
    guideEarning: number;

    paymentStatus: TPaymentStatus;
    paymentId?: Types.ObjectId

    status: TBookingStatus;
    cancelledBy?: TCancelledBy;
    expiresAt?: Date | null;
    isReviewd?: boolean;

    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    completedAt?:Date;
}

export interface Pagination {
    page: number;
    limit: number;
}

