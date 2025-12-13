import cron from "node-cron";
import { BookingModel } from "../modules/booking/booking.model";
import { TBookingStatus, TCancelledBy } from "../modules/booking/booking.interface";

cron.schedule("*/2 * * * *", async () => {
    const now = new Date();

    await BookingModel.updateMany(
        {
            status: TBookingStatus.PENDING,
            expiresAt: { $lt: now },
        },
        {
            status: TBookingStatus.CANCELLED,
            cancelledBy: TCancelledBy.SYSTEM,
        }
    );

    console.log("Expired bookings cancelled");
});


// SSLCommerz → callback → update booking

// ✅ Example
// async paymentSuccess(req: Request, res: Response) {
//   const { tran_id } = req.body;

//   const booking = await BookingModel.findOne({ paymentId: tran_id });

//   if (!booking) {
//     return res.status(404).send("Booking not found");
//   }

//   booking.paymentStatus = TPaymentStatus.PAID;
//   booking.status = TBookingStatus.CONFIRMED;

//   await booking.save();

//   return res.redirect(`${FRONTEND_URL}/payment-success`);
// }


// 📌 Only after this step is the booking officially confirmed