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

        // Tour
        const tour = await TourModel.findById(tourId)
            .select("createdBy maxGroupSize")
            .lean();

        if (!tour) throw new Error("Tour not found");

        const guideId = tour.createdBy;

        // Guide status
        const guideUser = await UserModel.findById(guideId)
            .select("userStatus")
            .lean();

        if (!guideUser || guideUser.userStatus !== TUserStatus.ACTIVE) {
            return {
                available: false,
                guideId,
                remainingSeats: 0,
                message: "Guide is not active",
            };
        }

        const haveOtherBookedTour = await BookingModel.findOne({
            guideId,
            tourId: { $ne: tourId },
            status: TBookingStatus.CONFIRMED,
            startDate: { $lte: end },
            endDate: { $gte: start },
        });

        if (haveOtherBookedTour) {
            return {
                available: false,
                guideId,
                remainingSeats: 0,
                message: "Guide already booked for another tour on selected dates",
            };
        }

        const sameTourBookings = await BookingModel.find({
            guideId,
            tourId,
            status: TBookingStatus.CONFIRMED,
            startDate: { $lte: end },
            endDate: { $gte: start },
        }).lean();

        const bookedPersons = sameTourBookings.reduce((sum, b) => sum + (b.persons || 0), 0);
        const maxSeats = tour.maxGroupSize || 1;
        const remainingSeats = Math.max(maxSeats - bookedPersons, 0);

        // Capacity check
        if (remainingSeats < persons) {
            return {
                available: false,
                guideId,
                remainingSeats,
                message: `Only ${remainingSeats} seat(s) left for selected dates`,
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
