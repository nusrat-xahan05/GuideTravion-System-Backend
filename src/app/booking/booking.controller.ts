/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import httpStatus from "http-status";


export const BookingController = {
    createBooking: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodeToken = req.user as JwtPayload
        const booking = await BookingService.createBooking(req.body, decodeToken.userId);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Booking created. Please complete payment.",
            data: booking,
        })
    }),

    listBookings: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const filters = {
            ...req.query
        };

        // cast page & limit
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await BookingService.listBookings(filters, { page, limit });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Bookings Retrieved Successfully",
            data: result.data,
            meta: result.meta
        });
    }),

};


// const getUserBookings = catchAsync(
//     async (req: Request, res: Response) => {
//         const bookings = await BookingService.getUserBookings();
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Bookings retrieved successfully",
//             data: bookings,
//         });
//     }
// );
// const getSingleBooking = catchAsync(
//     async (req: Request, res: Response) => {
//         const booking = await BookingService.getBookingById();
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Booking retrieved successfully",
//             data: booking,
//         });
//     }
// );

// const getAllBookings = catchAsync(
//     async (req: Request, res: Response) => {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         const bookings = await BookingService.getAllBookings();
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Bookings retrieved successfully",
//             data: {},
//             // meta: {},
//         });
//     }
// );

// const updateBookingStatus = catchAsync(
//     async (req: Request, res: Response) => {

//         const updated = await BookingService.updateBookingStatus(
//         );
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Booking Status Updated Successfully",
//             data: updated,
//         });
//     }
// );


// export const getBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const bookingId = req.params.id;
//   const booking = await BookingService.getBookingById(bookingId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Booking retrieved",
//     data: booking
//   });
// });



// export const cancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const bookingId = req.params.id;
//   const actorId = (req.user as any).userId;
//   const actorRole = (req.user as any).role;
//   const updated = await BookingService.cancelBooking(bookingId, actorId, actorRole);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Booking cancelled",
//     data: updated
//   });
// });
