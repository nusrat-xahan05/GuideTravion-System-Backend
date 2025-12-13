/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";


export enum TPaymentStatus {
    INITIATED = "INITIATED",
    PAID = "PAID",
    UNPAID = "UNPAID",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

export interface IPayment {
    _id?: Types.ObjectId;
    bookingId: Types.ObjectId;

    transactionId: string;          // SSLCommerz tran_id
    validationId?: string;          // val_id from SSLCommerz

    amount: number;
    currency: "BDT";
    status: TPaymentStatus;

    gatewayResponse?: any;           // Raw SSL response (audit/debug)
    paidAt?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}
