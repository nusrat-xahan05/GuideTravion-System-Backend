/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AvailabilityService } from "./checkAvailability.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


export const AvailabilityController = {
    check: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { tourId } = req.params; // or req.query.tourId
        const { start, end } = req.query; // ISO date strings expected

        const result = await AvailabilityService.checkGuideAvailability(
            tourId as string,
            String(start),
            String(end)
        );

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Booking created successfully",
            data: result,
        })
    }),
};