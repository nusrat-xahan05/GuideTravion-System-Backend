// import { Request, Response } from "express";
// import { envVars } from "../../config/env";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";
// import { SSLService } from "../sslCommerz/sslCommerz.service";
// import { PaymentService } from "./payment.service";

// const initPayment = catchAsync(async (req: Request, res: Response) => {
//     const bookingId = req.params.bookingId;
//     const result = await PaymentService.initPayment(bookingId as string)
//     sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "Payment done successfully",
//         data: result,
//     });
// });
// const successPayment = catchAsync(async (req: Request, res: Response) => {
//     const query = req.query
//     const result = await PaymentService.successPayment(query as Record<string, string>)

//     if (result.success) {
//         res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
//     }
// });
// const failPayment = catchAsync(async (req: Request, res: Response) => {
//     const query = req.query
//     const result = await PaymentService.failPayment(query as Record<string, string>)

//     if (!result.success) {
//         res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
//     }
// });
// const cancelPayment = catchAsync(async (req: Request, res: Response) => {
//     const query = req.query
//     const result = await PaymentService.cancelPayment(query as Record<string, string>)

//     if (!result.success) {
//         res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
//     }
// });

// const getInvoiceDownloadUrl = catchAsync(
//     async (req: Request, res: Response) => {
//         const { paymentId } = req.params;
//         const result = await PaymentService.getInvoiceDownloadUrl(paymentId);
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Invoice download URL retrieved successfully",
//             data: result,
//         });
//     }
// );
// const validatePayment = catchAsync(
//     async (req: Request, res: Response) => {
//         console.log("sslcommerz ipn url body", req.body);
//         await SSLService.validatePayment(req.body)
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Payment Validated Successfully",
//             data: null,
//         });
//     }
// );

// export const PaymentController = {
//     initPayment,
//     successPayment,
//     failPayment,
//     cancelPayment,
//     getInvoiceDownloadUrl,
//     validatePayment
// };


// payment.controller.ts
import { PaymentService } from "./payment.service";

export const PaymentController = {
    initiatePayment: async (req, res) => {
        try {
            const { bookingId } = req.body;
            const result = await PaymentService.initiatePayment(bookingId, req.user);

            res.json({
                success: true,
                url: result.paymentUrl,
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    paymentSuccess: async (req, res) => {
        try {
            const result = await PaymentService.verifySuccess(req.body);
            res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
        } catch (error: any) {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
        }
    },

    paymentFail: async (req, res) => {
        const result = await PaymentService.verifyFailed(req.body);
        res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    },

    paymentCancel: async (req, res) => {
        const result = await PaymentService.verifyCancelled(req.body);
        res.redirect(`${process.env.FRONTEND_URL}/payment-cancelled`);
    },
};
