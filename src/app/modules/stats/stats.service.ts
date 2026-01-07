import { UserModel } from "../user/user.model";
import { TourModel } from "../tour/tour.model";
import { BookingModel } from "../booking/booking.model";
import { TUserRole } from "../user/user.interface";
import { TTourStatusByAdmin } from "../tour/tour.interface";
import { TBookingStatus } from "../booking/booking.interface";
import { IAdminDashboardStats } from "./stats.interface";

export const StatsService = {
    async getAdminDashboardStats(): Promise<IAdminDashboardStats> {

        const [
            totalGuides,
            totalTourists,

            totalTours,
            approvedTours,
            pendingTours,
            rejectedTours,

            totalBookings,
            confirmedBookings,
            completedBookings,
            cancelledBookings,
        ] = await Promise.all([

            // Users
            UserModel.countDocuments({ role: TUserRole.GUIDE }),
            UserModel.countDocuments({ role: TUserRole.TOURIST }),

            // Tours
            TourModel.countDocuments(),
            TourModel.countDocuments({ statusByAdmin: TTourStatusByAdmin.APPROVED }),
            TourModel.countDocuments({ statusByAdmin: TTourStatusByAdmin.PENDING }),
            TourModel.countDocuments({ statusByAdmin: TTourStatusByAdmin.REJECTED }),

            // Bookings
            BookingModel.countDocuments(),
            BookingModel.countDocuments({ status: TBookingStatus.CONFIRMED }),
            BookingModel.countDocuments({ status: TBookingStatus.COMPLETED }),
            BookingModel.countDocuments({ status: TBookingStatus.CANCELLED }),
        ]);

        return {
            totalGuides,
            totalTourists,

            totalTours,
            approvedTours,
            pendingTours,
            rejectedTours,

            totalBookings,
            confirmedBookings,
            completedBookings,
            cancelledBookings,
        };
    },
};
