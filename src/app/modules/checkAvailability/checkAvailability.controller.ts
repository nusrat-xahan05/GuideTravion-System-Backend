/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AvailabilityService } from "./checkAvailability.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


export const AvailabilityController = {
    check: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { tourId, startDate, endDate, persons } = req.query; // ISO date strings expected

        const result = await AvailabilityService.checkGuideAvailability(
            tourId as string,
            startDate as string,
            endDate as string,
            Number(persons)
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Availability Checked Successfully",
            data: result,
        })
    }),
};