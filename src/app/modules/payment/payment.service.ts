// /* eslint-disable @typescript-eslint/no-explicit-any */
// import httpStatus from "http-status-codes";
// import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
// import AppError from "../../errorHelpers/AppError";
// import { generatePdf, IInvoiceData } from "../../utils/invoice";
// import { sendEmail } from "../../utils/sendEmail";
// import { BOOKING_STATUS } from "../booking/booking.interface";
// import { Booking } from "../booking/booking.model";
// import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
// import { SSLService } from "../sslCommerz/sslCommerz.service";
// import { ITour } from "../tour/tour.interface";
// import { IUser } from "../user/user.interface";
// import { PAYMENT_STATUS } from "./payment.interface";
// import { Payment } from "./payment.model";



// const initPayment = async (bookingId: string) => {

//     const payment = await Payment.findOne({ booking: bookingId })

//     if (!payment) {
//         throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
//     }

//     const booking = await Booking.findById(payment.booking)

//     const userAddress = (booking?.user as any).address
//     const userEmail = (booking?.user as any).email
//     const userPhoneNumber = (booking?.user as any).phone
//     const userName = (booking?.user as any).name

//     const sslPayload: ISSLCommerz = {
//         address: userAddress,
//         email: userEmail,
//         phoneNumber: userPhoneNumber,
//         name: userName,
//         amount: payment.amount,
//         transactionId: payment.transactionId
//     }

//     const sslPayment = await SSLService.sslPaymentInit(sslPayload)

//     return {
//         paymentUrl: sslPayment.GatewayPageURL
//     }

// };
// const successPayment = async (query: Record<string, string>) => {

//     // Update Booking Status to COnfirm 
//     // Update Payment Status to PAID

//     const session = await Booking.startSession();
//     session.startTransaction()

//     try {


//         const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
//             status: PAYMENT_STATUS.PAID,
//         }, { new: true, runValidators: true, session: session })

//         if (!updatedPayment) {
//             throw new AppError(401, "Payment not found")
//         }

//         const updatedBooking = await Booking
//             .findByIdAndUpdate(
//                 updatedPayment?.booking,
//                 { status: BOOKING_STATUS.COMPLETE },
//                 { new: true, runValidators: true, session }
//             )
//             .populate("tour", "title")
//             .populate("user", "name email")

//         if (!updatedBooking) {
//             throw new AppError(401, "Booking not found")
//         }

//         const invoiceData: IInvoiceData = {
//             bookingDate: updatedBooking.createdAt as Date,
//             guestCount: updatedBooking.guestCount,
//             totalAmount: updatedPayment.amount,
//             tourTitle: (updatedBooking.tour as unknown as ITour).title,
//             transactionId: updatedPayment.transactionId,
//             userName: (updatedBooking.user as unknown as IUser).name
//         }

//         const pdfBuffer = await generatePdf(invoiceData)

//         const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")

//         if (!cloudinaryResult) {
//             throw new AppError(401, "Error uploading pdf")
//         }

//         await Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session })

//         await sendEmail({
//             to: (updatedBooking.user as unknown as IUser).email,
//             subject: "Your Booking Invoice",
//             templateName: "invoice",
//             templateData: invoiceData,
//             attachments: [
//                 {
//                     filename: "invoice.pdf",
//                     content: pdfBuffer,
//                     contentType: "application/pdf"
//                 }
//             ]
//         })

//         await session.commitTransaction(); //transaction
//         session.endSession()
//         return { success: true, message: "Payment Completed Successfully" }
//     } catch (error) {
//         await session.abortTransaction(); // rollback
//         session.endSession()
//         // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
//         throw error
//     }
// };
// const failPayment = async (query: Record<string, string>) => {

//     // Update Booking Status to FAIL
//     // Update Payment Status to FAIL

//     const session = await Booking.startSession();
//     session.startTransaction()

//     try {


//         const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
//             status: PAYMENT_STATUS.FAILED,
//         }, { new: true, runValidators: true, session: session })

//         await Booking
//             .findByIdAndUpdate(
//                 updatedPayment?.booking,
//                 { status: BOOKING_STATUS.FAILED },
//                 { runValidators: true, session }
//             )

//         await session.commitTransaction(); //transaction
//         session.endSession()
//         return { success: false, message: "Payment Failed" }
//     } catch (error) {
//         await session.abortTransaction(); // rollback
//         session.endSession()
//         // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
//         throw error
//     }
// };
// const cancelPayment = async (query: Record<string, string>) => {

//     // Update Booking Status to CANCEL
//     // Update Payment Status to CANCEL

//     const session = await Booking.startSession();
//     session.startTransaction()

//     try {


//         const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
//             status: PAYMENT_STATUS.CANCELLED,
//         }, { runValidators: true, session: session })

//         await Booking
//             .findByIdAndUpdate(
//                 updatedPayment?.booking,
//                 { status: BOOKING_STATUS.CANCEL },
//                 { runValidators: true, session }
//             )

//         await session.commitTransaction(); //transaction
//         session.endSession()
//         return { success: false, message: "Payment Cancelled" }
//     } catch (error) {
//         await session.abortTransaction(); // rollback
//         session.endSession()
//         // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
//         throw error
//     }
// };

// const getInvoiceDownloadUrl = async (paymentId: string) => {
//     const payment = await Payment.findById(paymentId)
//         .select("invoiceUrl")

//     if (!payment) {
//         throw new AppError(401, "Payment not found")
//     }

//     if (!payment.invoiceUrl) {
//         throw new AppError(401, "No invoice found")
//     }

//     return payment.invoiceUrl
// };


// export const PaymentService = {
//     initPayment,
//     successPayment,
//     failPayment,
//     cancelPayment,
//     getInvoiceDownloadUrl
// };



// payment.service.ts
import axios from "axios";
import { PaymentModel } from "./payment.model";
import { BookingModel } from "../booking/booking.model";
import mongoose from "mongoose";

export const PaymentService = {
    async initiatePayment(bookingId: string, user: any) {
        const booking = await BookingModel.findById(bookingId)
            .populate("tourId")
            .lean();

        if (!booking) throw new Error("Booking not found");
        if (booking.status === "PAID") throw new Error("Already paid");

        const transactionId = `TXN-${Date.now()}`;

        const payment = await PaymentModel.create({
            bookingId,
            amount: booking.totalPrice,
            currency: "BDT",
            transactionId,
            status: "INITIATED",
        });

        // SSLCommerz payload
        const payload = {
            store_id: process.env.SSLC_STORE_ID!,
            store_passwd: process.env.SSLC_STORE_PASS!,
            total_amount: booking.totalPrice,
            currency: "BDT",
            tran_id: transactionId,
            success_url: `${process.env.BASE_URL}/api/payment/success`,
            fail_url: `${process.env.BASE_URL}/api/payment/fail`,
            cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,
            emi_option: 0,

            // Customer Information
            cus_name: user.name,
            cus_email: user.email,
            cus_add1: "Dhaka",
            cus_country: "Bangladesh",
            cus_phone: user.phone || "00000000",

            product_name: "Tour Booking",
            product_category: "Tour",
            product_profile: "general",
        };

        const response = await axios({
            method: "POST",
            url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            data: payload,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (!response.data.GatewayPageURL)
            throw new Error("SSLCommerz session creation failed");

        return { paymentUrl: response.data.GatewayPageURL };
    },

    async verifySuccess(data: any) {
        const { tran_id } = data;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const payment = await PaymentModel.findOne({ transactionId: tran_id });
            if (!payment) throw new Error("Payment not found");

            payment.status = "SUCCESS";
            await payment.save({ session });

            await BookingModel.findByIdAndUpdate(
                payment.bookingId,
                { status: "PAID" },
                { session }
            );

            await session.commitTransaction();
            return { message: "Payment Successful" };
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    },

    async verifyFailed(data: any) {
        const { tran_id } = data;

        await PaymentModel.findOneAndUpdate(
            { transactionId: tran_id },
            { status: "FAILED" }
        );

        return { message: "Payment Failed" };
    },

    async verifyCancelled(data: any) {
        const { tran_id } = data;

        await PaymentModel.findOneAndUpdate(
            { transactionId: tran_id },
            { status: "CANCELLED" }
        );

        return { message: "Payment Cancelled" };
    },
};
