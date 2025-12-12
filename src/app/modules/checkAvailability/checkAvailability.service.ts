/* eslint-disable @typescript-eslint/no-explicit-any */
import { TourModel } from "../tour/tour.model";
import { BookingModel } from "../booking/booking.model";
import { TUserStatus } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { TBookingStatus } from "../booking/booking.interface";
import { Types } from "mongoose";



export type AvailabilityResult =
    | { available: true; guideId: Types.ObjectId; message: string }
    | { available: false; guideId: Types.ObjectId; reason: string; conflictingBooking?: any };

export const AvailabilityService = {
    checkGuideAvailability: async (tourId: string, startIn: Date | string, endIn: Date | string): Promise<AvailabilityResult> => {
        // 0. Validate inputs and normalize to Date
        const start = startIn instanceof Date ? startIn : new Date(String(startIn));
        const end = endIn instanceof Date ? endIn : new Date(String(endIn));

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid start or end date provided.");
        }
        if (start > end) {
            throw new Error("Start date must be before or equal to end date.");
        }

        // 1. Find tour and its assigned guide id
        const tour = await TourModel.findById(tourId).select("createdBy title").lean();
        if (!tour) {
            throw new Error("Tour not found");
        }

        const guideId = tour.createdBy;
        if (!guideId) {
            throw new Error("Tour has no assigned guide");
        }

        // 2. Ensure the guide's user exists and is ACTIVE
        // Note: guideId is the Guide document _id which equals the corresponding User _id in your schema design
        const guideUser = await UserModel.findById(guideId).select("userStatus isVerified firstName email").lean();
        if (!guideUser) {
            throw new Error("Guide (user) not found");
        }
        if (guideUser.userStatus !== TUserStatus.ACTIVE) {
            throw new Error("Guide is not active");
        }

        // 3. Check for overlapping CONFIRMED bookings only (PENDING does NOT block)
        const overlapping = await BookingModel.findOne({
            guideId: guideId,
            status: { $in: [TBookingStatus.CONFIRMED] }, // only confirmed bookings block availability
            $or: [
                {
                    startDate: { $lte: end },
                    endDate: { $gte: start }
                }
            ]
        }).lean();

        if (overlapping) {
            return {
                available: false,
                guideId: new Types.ObjectId(String(guideId)),
                reason: "Guide is busy in another confirmed booking during this time.",
                conflictingBooking: overlapping
            };
        }

        // 4. No conflicts -> available
        return {
            available: true,
            guideId: new Types.ObjectId(String(guideId)),
            message: "Guide is available for the selected dates."
        };
    }
};
