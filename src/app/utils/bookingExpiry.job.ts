import cron from "node-cron";
import { BookingModel } from "../modules/booking/booking.model";
import { TBookingStatus, TCancelledBy } from "../modules/booking/booking.interface";
import { TPaymentStatus } from "../modules/payment/payment.interface";

cron.schedule("*/1 * * * *", async () => {
    try {
        const now = new Date();

        const result = await BookingModel.updateMany(
            {
                status: TBookingStatus.PENDING,
                paymentStatus: TPaymentStatus.UNPAID,
                expiresAt: { $lt: now },
            },
            {
                $set: {
                    status: TBookingStatus.CANCELLED,
                    cancelledBy: TCancelledBy.SYSTEM,
                },
            }
        );

        if (result.modifiedCount > 0) {
            console.log(
                `[CRON] Auto-cancelled ${result.modifiedCount} expired bookings`
            );
        }
    } catch (error) {
        console.error("[CRON] Booking expiry job failed", error);
    }
});
