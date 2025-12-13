import { TourModel } from "../tour/tour.model";
import { BookingModel } from "../booking/booking.model";
import { TUserStatus } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { TBookingStatus } from "../booking/booking.interface";
import { AvailabilityResult } from "./checkAvailability.interface";



export const AvailabilityService = {
    checkGuideAvailability: async (
        tourId: string,
        startIn: Date | string,
        endIn: Date | string,
        persons: number
    ): Promise<AvailabilityResult> => {

        const start = new Date(startIn);
        const end = new Date(endIn);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
            throw new Error("Invalid booking dates");
        }

        if (!persons || persons <= 0) {
            throw new Error("Invalid number of persons");
        }

        // 1️⃣ Tour
        const tour = await TourModel.findById(tourId)
            .select("createdBy maxGroupSize")
            .lean();

        if (!tour) throw new Error("Tour not found");

        const guideId = tour.createdBy;

        // 2️⃣ Guide status
        const guideUser = await UserModel.findById(guideId)
            .select("userStatus")
            .lean();

        if (!guideUser || guideUser.userStatus !== TUserStatus.ACTIVE) {
            return {
                available: false,
                guideId,
                remainingSeats: 0,
                reason: "Guide is not active",
            };
        }

        // 3️⃣ Overlapping bookings (CONFIRMED + PENDING)
        const bookings = await BookingModel.find({
            guideId,
            status: { $in: [TBookingStatus.CONFIRMED] },
            startDate: { $lte: end },
            endDate: { $gte: start },
        }).lean();

        const bookedPersons = bookings.reduce(
            (sum, b) => sum + (b.persons || 0),
            0
        );

        const maxSeats = tour.maxGroupSize || 1;
        const remainingSeats = Math.max(maxSeats - bookedPersons, 0);

        // 4️⃣ Capacity check
        if (remainingSeats < persons) {
            return {
                available: false,
                guideId,
                remainingSeats,
                reason: `Only ${remainingSeats} seat(s) left`,
            };
        }

        return {
            available: true,
            guideId,
            remainingSeats,
            message: "Guide is available for selected dates",
        };
    },
};
