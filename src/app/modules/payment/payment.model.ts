// import { model, Schema } from "mongoose";
// import { IPayment, PAYMENT_STATUS } from "./payment.interface";


// const paymentSchema = new Schema<IPayment>({
//     booking: {
//         type: Schema.Types.ObjectId,
//         ref: "Booking",
//         required: true,
//         unique: true,
//     },
//     transactionId: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     status: {
//         type: String,
//         enum: Object.values(PAYMENT_STATUS),
//         default: PAYMENT_STATUS.UNPAID
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     paymentGatewayData: {
//         type: Schema.Types.Mixed
//     },
//     invoiceUrl: {
//         type: String
//     }
// }, {
//     timestamps: true
// })

// export const Payment = model<IPayment>("Payment", paymentSchema)


// payment.model.ts
import { Schema, model } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "BDT" },
        transactionId: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ["INITIATED", "SUCCESS", "FAILED", "CANCELLED"],
            default: "INITIATED",
        },
    },
    {
        timestamps: true,
    }
);

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
