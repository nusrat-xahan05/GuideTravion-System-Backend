import { IPayment, TPaymentStatus } from "./payment.interface";
import { Schema, model } from "mongoose";

const paymentSchema = new Schema<IPayment>({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        index: true,
        // unique: true,
    },

    transactionId: {
        type: String,
        required: true,
        unique: true,
    },

    validationId: {
        type: String,
    },

    amount: {
        type: Number,
        required: true,
    },

    currency: {
        type: String,
        enum: ["BDT"],
        default: "BDT",
    },

    status: {
        type: String,
        enum: Object.values(TPaymentStatus),
        required: true,
    },

    gatewayResponse: {
        type: Schema.Types.Mixed,
    },

    paidAt: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false
});


export const PaymentModel = model<IPayment>("Payment", paymentSchema);
