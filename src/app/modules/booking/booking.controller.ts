/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import httpStatus from "http-status";
import { TUserRole } from "../user/user.interface";


export const BookingController = {
    getActiveBookings: catchAsync(async (req: Request, res: Response) => {
        const decoded = req.user as JwtPayload;
        const query = req.query;
        const bookings = await BookingService.getActiveBookings(decoded.userId, decoded.role as TUserRole, query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Active Booked Tour Retrieved Successfully",
            data: bookings,
        });
    }),


    getUpcomingBookings: catchAsync(async (req: Request, res: Response) => {
        const decoded = req.user as JwtPayload;
        const query = req.query;
        const bookings = await BookingService.getUpcomingBookings(decoded.userId, decoded.role as TUserRole, query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Upcoming Booked Tour Retrieved Successfully",
            data: bookings,
        });
    }),


    getCompletedBookings: catchAsync(async (req: Request, res: Response) => {
        const decoded = req.user as JwtPayload;
        const query = req.query;
        const bookings = await BookingService.getCompletedBookings(decoded.userId, decoded.role as TUserRole,
             query as Record<string, string>
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Completed Booked Tours Retrieved Successfully",
            data: bookings,
        });
    }),


    getCancelledBookings: catchAsync(async (req: Request, res: Response) => {
        const decoded = req.user as JwtPayload;
        const query = req.query;
        const bookings = await BookingService.getCancelledBookings(decoded.userId, decoded.role as TUserRole,
             query as Record<string, string>
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Cancelled Booked Tours Retrieved Successfully",
            data: bookings,
        });
    }),


    // MY BOOKINGS
    getUserBookings: catchAsync(async (req: Request, res: Response) => {
        const decoded = req.user as JwtPayload;

        const bookings = await BookingService.getUserBookings(
            decoded.userId,
            decoded.role as TUserRole
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User bookings retrieved",
            data: bookings,
        });
    }),


    listBookings: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await BookingService.listBookings(req.query, { page, limit });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Bookings Retrieved Successfully",
            data: result.data,
            meta: result.meta
        });
    }),


    // CREATE BOOKING ------ (TOURIST ENDPOINT)
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


    cancelBooking: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const bookingId = req.params.id;
        const actorId = (req.user as JwtPayload).userId;
        const actorRole = (req.user as JwtPayload).role;
        const updated = await BookingService.cancelBooking(bookingId, actorId, actorRole);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking cancelled",
            data: updated
        });
    })
};


