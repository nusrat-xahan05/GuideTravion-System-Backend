import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { BookingModel } from "../booking/booking.model";
import { ReviewModel } from "./review.model";
import { TourModel } from "../tour/tour.model";
import { TBookingStatus } from "../booking/booking.interface";
import { TPaymentStatus } from "../payment/payment.interface";
import { IReview } from "./review.interface";

export const ReviewService = {
    // ================= CREATE REVIEW =================
    async createReview(
        // payload: { bookingId: string; rating: number; review?: string },
        payload: IReview,
        touristId: string
    ) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1️⃣ Validate booking
            const booking = await BookingModel.findById(payload.bookingId).session(
                session
            );

            if (!booking) {
                throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
            }

            // 2️⃣ Ownership check
            if (booking.touristId.toString() !== touristId) {
                throw new AppError(httpStatus.FORBIDDEN, "Unauthorized booking access");
            }

            // 3️⃣ Booking must be completed + paid
            if (
                booking.status !== TBookingStatus.COMPLETED ||
                booking.paymentStatus !== TPaymentStatus.PAID
            ) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "You can review only after completing the tour"
                );
            }

            // 4️⃣ Prevent duplicate review
            const existingReview = await ReviewModel.findOne({
                bookingId: booking._id,
            }).session(session);

            if (existingReview) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "Review already submitted for this booking"
                );
            }

            // 5️⃣ Create review
            const review = await ReviewModel.create(
                [
                    {
                        bookingId: booking._id,
                        tourId: booking.tourId,
                        touristId: booking.touristId,
                        guideId: booking.guideId,
                        rating: payload.rating,
                        review: payload.review,
                    },
                ],
                { session }
            );

            // 6️⃣ Recalculate tour rating
            const stats = await ReviewModel.aggregate([
                { $match: { tourId: booking.tourId } },
                {
                    $group: {
                        _id: "$tourId",
                        avgRating: { $avg: "$rating" },
                        totalReviews: { $sum: 1 },
                    },
                },
            ]).session(session);

            await TourModel.findByIdAndUpdate(
                booking.tourId,
                {
                    averageRating: Number(stats[0].avgRating.toFixed(2)),
                    totalReviews: stats[0].totalReviews,
                },
                { session }
            );

            await BookingModel.findByIdAndUpdate(
                booking._id, { isReviewd: true },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return review[0];
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },


    // ================= GET REVIEWS BY TOUR =================
    async getReviewsByTour(tourId: string) {
        return ReviewModel.find({ tourId })
            .populate("touristId", "firstName profileImage")
            .sort({ createdAt: -1 });
    },
    

    // ================= CHECK REVIEW ELIGIBILITY =================
    async checkEligibility(tourId: string, touristId: string) {
        const booking = await BookingModel.findOne({
            tourId,
            touristId,
            status: TBookingStatus.COMPLETED,
            paymentStatus: TPaymentStatus.PAID,
        });

        if (!booking) {
            return { canReview: false };
        }

        const existingReview = await ReviewModel.findOne({
            bookingId: booking._id,
        });

        if (existingReview) {
            return { canReview: false };
        }

        return {
            canReview: true,
            bookingId: booking._id,
        };
    },
};
