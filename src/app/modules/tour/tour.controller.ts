/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { TourServices } from "./tour.service";

export const TourController = {
    // CREATE TOUR ------ (GUIDE ENDPOINT)
    createTour: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        console.log('decoded Token: ', decodedToken);
        const result = await TourServices.createTour(req.body, decodedToken);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Tour Created Successfully",
            data: result,
        })
    }),
};
