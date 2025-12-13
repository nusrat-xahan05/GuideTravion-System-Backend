/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import mongoose from "mongoose";
import { BookingModel } from "../booking/booking.model";
import { PaymentModel } from "./payment.model";
import { TPaymentStatus } from "./payment.interface";
import { TBookingStatus } from "../booking/booking.interface";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { getTransactionId } from "../../utils/getTransactionId";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { UserModel } from "../user/user.model";


export const PaymentService = {
    // ================= INITIATE PAYMENT =================
    async initiatePayment(bookingId: string, decodedToken: JwtPayload) {
        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found");
        }
        if (booking.paymentStatus === TPaymentStatus.PAID) {
            throw new AppError(httpStatus.BAD_REQUEST, "Booking Already Paid");
        }
        if (booking.expiresAt && booking.expiresAt < new Date()) {
            throw new AppError(httpStatus.BAD_REQUEST, "Booking Expired");
        }

        const existingPayment = await PaymentModel.findOne({
            bookingId,
            status: TPaymentStatus.INITIATED,
        });
        if (existingPayment) {
            throw new AppError(httpStatus.BAD_REQUEST, "Payment already initiated for this booking");
        }

        const transactionId = getTransactionId()
        // const transactionId = `TXN-${Date.now()}`;

        await PaymentModel.create({
            bookingId,
            transactionId,
            amount: booking.totalAmount,
            currency: "BDT",
            status: TPaymentStatus.INITIATED,
        });

        const userInfo = await UserModel.findById(decodedToken.userId);
        if (!userInfo) {
            throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
        }

        const payload = {
            store_id: envVars.SSL.SSL_STORE_ID as string,
            store_passwd: envVars.SSL.SSL_STORE_PASS as string,
            total_amount: booking.totalAmount.toString(),
            currency: "BDT",
            tran_id: transactionId,

            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}`,
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}`,

            // success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${transactionId}&amount=${booking.totalAmount}&status=success`,
            // fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${transactionId}&amount=${booking.totalAmount}&status=fail`,
            // cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${transactionId}&amount=${booking.totalAmount}&status=cancel`,

            cus_name: userInfo.firstName,
            cus_email: userInfo.email,
            cus_phone: userInfo.phone || "0000000000",
            cus_address: userInfo.address || " ",
            cus_country: userInfo.country,

            product_name: "Tour Booking",
            product_profile: "general",
        };

        // const response = await axios({
        //     method: "POST",
        //     url: envVars.SSL.SSL_PAYMENT_API,
        //     data: data,
        //     headers: { "Content-Type": "application/x-www-form-urlencoded" }
        // })

        const response = await axios.post(
            "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            new URLSearchParams(payload).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (!response.data?.GatewayPageURL) {
            throw new AppError(httpStatus.BAD_REQUEST, "SSL session failed");
        }
        return { paymentUrl: response.data.GatewayPageURL };
    },


    // ================= PAYMENT SUCCESS =================
    async handleSuccess(payload: any) {
        const { tran_id, val_id } = payload;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: tran_id }, {
                status: TPaymentStatus.PAID,
                validationId: val_id,
                paidAt: new Date(),
                gatewayResponse: payload
            }, { new: true, runValidators: true, session: session })

            if (!updatedPayment) throw new Error("Payment not found");

            await BookingModel.findByIdAndUpdate(updatedPayment.bookingId,
                {
                    paymentStatus: TPaymentStatus.PAID,
                    status: TBookingStatus.CONFIRMED,
                }, { new: true, runValidators: true, session });

            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    },

    // ================= PAYMENT FAILED =================
    async handleFailure(payload: any) {
        const { tran_id } = payload;

        await PaymentModel.findOneAndUpdate({ transactionId: tran_id }, {
            status: TPaymentStatus.FAILED,
            gatewayResponse: payload
        }, { new: true, runValidators: true });
    },

    // ================= PAYMENT CANCELLED =================
    async handleCancel(payload: any) {
        const { tran_id } = payload;

        await PaymentModel.findOneAndUpdate({ transactionId: tran_id }, {
            status: TPaymentStatus.CANCELLED, gatewayResponse: payload
        }, { new: true, runValidators: true });
    },
};
// const successPayment = async (query: Record<string, string>) => {

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