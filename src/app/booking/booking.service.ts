/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IBooking, TBookingStatus } from "./booking.interface";
import { TourModel } from "../tour/tour.model";
import { BookingModel } from "./booking.model";
import { Types } from "mongoose";
import { TTourStatus } from "../tour/tour.interface";
import { UserModel } from "../user/user.model";
import { TUserStatus } from "../user/user.interface";
import { TPaymentStatus } from "../payment/payment.interface";


export const BookingService = {
    async createBooking(payload: Partial<IBooking>, touristId: string) {
        const session = await BookingModel.startSession();

        try {
            session.startTransaction();

            // 1️⃣ Validate Tour
            const tour = await TourModel.findById(payload.tourId).session(session);
            if (!tour) {
                throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
            }
            if (tour.status !== TTourStatus.ACTIVE) {
                throw new AppError(httpStatus.BAD_REQUEST, "Tour is not active");
            }

            // 2️⃣ Validate Guide
            const guideId = tour.createdBy;
            const guideUser = await UserModel.findById(guideId).session(session);
            if (!guideUser || guideUser.userStatus !== TUserStatus.ACTIVE) {
                throw new AppError(httpStatus.BAD_REQUEST, "Guide is not active");
            }

            // 3️⃣ Validate Dates
            if (!payload.startDate || !payload.endDate) {
                throw new AppError(httpStatus.BAD_REQUEST, "Start date and end date are required");
            }
            const start = new Date(payload.startDate);
            const end = new Date(payload.endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
                throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking dates");
            }

            // 4️⃣ Validate Persons
            const persons = Number(payload.persons);
            if (!persons || persons <= 0) {
                throw new AppError(httpStatus.BAD_REQUEST, "Invalid number of persons");
            }

            // 5️⃣ Check Existing Bookings (PENDING + CONFIRMED)
            const existingBookings = await BookingModel.find({
                guideId,
                status: { $in: [TBookingStatus.CONFIRMED, TBookingStatus.PENDING] },
                $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
            }).session(session);

            // 6️⃣ Capacity Check
            const alreadyBooked = existingBookings.reduce((sum, b) => sum + (b.persons || 0), 0);
            if (tour.maxGroupSize && alreadyBooked + persons > tour.maxGroupSize) {
                throw new AppError(httpStatus.BAD_REQUEST, "Not enough seats available");
            }

            // 7️⃣ Calculate Price + Platform Fee
            const pricePerPerson = tour.pricePerPerson;
            const totalAmount = pricePerPerson * persons;

            const PLATFORM_FEE_PERCENT = 0.1; // 10%
            const platformFee = totalAmount * PLATFORM_FEE_PERCENT;
            const guideEarning = totalAmount - platformFee;

            // 8️⃣ Create Booking (Soft Lock)
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            const booking = await BookingModel.create(
                [
                    {
                        tourId: tour._id,
                        guideId,
                        touristId,
                        startDate: start,
                        endDate: end,
                        persons,
                        meetingTime: payload.meetingTime,
                        pickupLocation: payload.pickupLocation,
                        dropoffLocation: payload.dropoffLocation,
                        totalAmount,
                        platformFee,
                        guideEarning,
                        paymentStatus: TPaymentStatus.UNPAID,
                        status: TBookingStatus.PENDING,
                        expiresAt,
                        notes: payload.notes,
                    }], { session }
            );

            await session.commitTransaction();
            session.endSession();

            return booking[0];
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },


    async listBookings(filters: any = {}, options: { page?: number; limit?: number } = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;

        // build mongo filter (simple)
        const q: any = {};
        if (filters.tourId && Types.ObjectId.isValid(filters.tourId)) q.tourId = filters.tourId;
        if (filters.touristId && Types.ObjectId.isValid(filters.touristId)) q.touristId = filters.touristId;
        if (filters.guideId && Types.ObjectId.isValid(filters.guideId)) q.guideId = filters.guideId;
        if (filters.status) q.status = filters.status;
        if (filters.paymentStatus) q.paymentStatus = filters.paymentStatus;
        if (filters.date) {
            const d = new Date(filters.date);
            d.setUTCHours(0, 0, 0, 0);
            q.date = d;
        }

        const [data, total] = await Promise.all([
            BookingModel.find(q)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: "tourId", select: "title slug" })
                .populate({ path: "touristId", select: "firstName lastName email" })
                .populate({ path: "guideId", select: "occupation rating" })
                .lean(),
            BookingModel.countDocuments(q)
        ]);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit)
            }
        };
    },
};

// ----------------------
// const transactionId = getTransactionId()

// const session = await Booking.startSession();
// session.startTransaction()

// try {
//     const user = await User.findById(userId);
//     if (!user?.phone || !user.address) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
//     }

//     const tour = await Tour.findById(payload.tour).select("costFrom")
//     if (!tour?.costFrom) {
//         throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!")
//     }

//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const amount = Number(tour.costFrom) * Number(payload.guestCount!)
//     const booking = await Booking.create([{
//         user: userId,
//         status: BOOKING_STATUS.PENDING,
//         ...payload
//     }], { session })

//     const payment = await Payment.create([{
//         booking: booking[0]._id,
//         status: PAYMENT_STATUS.UNPAID,
//         transactionId: transactionId,
//         amount: amount
//     }], { session })

//     const updatedBooking = await Booking
//         .findByIdAndUpdate(
//             booking[0]._id,
//             { payment: payment[0]._id },
//             { new: true, runValidators: true, session }
//         )
//         .populate("user", "name email phone address")
//         .populate("tour", "title costFrom")
//         .populate("payment");

//     const userAddress = (updatedBooking?.user as any).address
//     const userEmail = (updatedBooking?.user as any).email
//     const userPhoneNumber = (updatedBooking?.user as any).phone
//     const userName = (updatedBooking?.user as any).name

//     const sslPayload: ISSLCommerz = {
//         address: userAddress,
//         email: userEmail,
//         phoneNumber: userPhoneNumber,
//         name: userName,
//         amount: amount,
//         transactionId: transactionId
//     }

//     const sslPayment = await SSLService.sslPaymentInit(sslPayload)
//     console.log(sslPayment);
//     await session.commitTransaction(); //transaction
//     session.endSession()
//     return {
//         paymentUrl: sslPayment.GatewayPageURL,
//         booking: updatedBooking
//     }
// } catch (error) {
//     await session.abortTransaction(); // rollback
//     session.endSession()
//     // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
//     throw error
// }


// /**
//  * Get booking by id (with optional population)
//  */
// static async getBookingById(bookingId: string) {
//     if (!Types.ObjectId.isValid(bookingId)) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking id");
//     }
//     // populate user and tour + guide
//     const booking = await BookingModel.findById(bookingId)
//         .populate({ path: "tourId", select: "title slug pricePerPerson durationDays images" })
//         .populate({ path: "touristId", select: "firstName lastName email profileImage" })
//         .populate({ path: "guideId", select: "occupation rating" })
//         .lean();

//     if (!booking) {
//         throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
//     }
//     return booking;
// }


//     /**
//      * Cancel booking (tourist or admin or guide depending on your rules)
//      * returns updated booking
//      */
//     static async cancelBooking(bookingId: string, actorId: string, actorRole: string) {
//         const booking = await BookingModel.findById(bookingId);
//         if (!booking) throw new AppError(httpStatus.NOT_FOUND, "Booking not found");

//         // optionally implement rules: e.g., tourist can cancel before X hours, admin always can
//         if (booking.status === TBookingStatus.CANCELLED) {
//             throw new AppError(httpStatus.BAD_REQUEST, "Booking already cancelled");
//         }

//         // simple cancellation
//         booking.status = TBookingStatus.CANCELLED;
//         // if paid, you may initiate refund flow (outside scope)
//         if (booking.paymentStatus === TPaymentStatus.PAID) {
//             booking.paymentStatus = TPaymentStatus.REFUNDED; // mark, and trigger refund process
//         }
//         await booking.save();

//         return booking;
//     }
// }



// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

