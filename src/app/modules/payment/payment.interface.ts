// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Types } from "mongoose";

// export enum PAYMENT_STATUS {
//     PAID = "PAID",
//     UNPAID = "UNPAID",
//     CANCELLED = "CANCELLED",
//     FAILED = "FAILED",
//     REFUNDED = "REFUNDED"
// }

// export interface IPayment {
//     booking: Types.ObjectId;
//     transactionId: string;
//     amount: number;
//     paymentGatewayData?: any
//     invoiceUrl?: string
//     status: PAYMENT_STATUS
// }

// payment.interface.ts
export type TPaymentStatus = "INITIATED" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface IPayment {
    bookingId: string;
    amount: number;
    currency: string;
    transactionId: string;
    status: TPaymentStatus;
}
