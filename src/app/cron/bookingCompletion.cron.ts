import cron from "node-cron";
import { BookingModel } from "../modules/booking/booking.model";
import { TBookingStatus } from "../modules/booking/booking.interface";
import { TPaymentStatus } from "../modules/payment/payment.interface";


export const startBookingCompletionJob = () => {
    cron.schedule("0 * * * *", async () => {
        console.log("[CRON] Checking booking completion...", new Date());
        try {
            const now = new Date();

            const result = await BookingModel.updateMany(
                {
                    status: TBookingStatus.CONFIRMED,
                    paymentStatus: TPaymentStatus.PAID,
                    endDate: { $lt: now },
                },
                {
                    $set: {
                        status: TBookingStatus.COMPLETED,
                        completedAt: now,
                    },
                }
            );

            if (result.modifiedCount > 0) {
                console.log(
                    `[CRON] ${result.modifiedCount} booking(s) marked as COMPLETED`
                );
            }
        } catch (error) {
            console.error("[CRON] Booking completion failed:", error);
        }
    });
};
