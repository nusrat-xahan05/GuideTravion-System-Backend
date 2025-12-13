/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import { envVars } from "../../config/env";

export const PaymentController = {
    initiatePayment: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { bookingId } = req.body;
        const decodedToken = req.user as JwtPayload;

        const result = await PaymentService.initiatePayment(bookingId, decodedToken);

        // res.status(httpStatus.OK).json({
        //     success: true,
        //     paymentUrl: result.paymentUrl,
        // });
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Payment done successfully",
            // data: result,
            data: result.paymentUrl
        });
    }),


    paymentSuccess: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await PaymentService.handleSuccess(req.body);
            res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}`);
        } catch {
            res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}`);
        }
    }),


    paymentFail: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await PaymentService.handleFailure(req.body);
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}`);
    }),


    paymentCancel: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await PaymentService.handleCancel(req.body);
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}/payment-cancelled`);
    }),
};

// const failPayment = catchAsync(async (req: Request, res: Response) => {
//     const query = req.query
//     const result = await PaymentService.failPayment(query as Record<string, string>)

//     if (!result.success) {
//         res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
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