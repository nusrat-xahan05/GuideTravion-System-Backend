/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { TourServices } from "./tour.service";
import { ITour } from "./tour.interface";

export const TourController = {
    // CREATE TOUR ------ (GUIDE ENDPOINT)
    createTour: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
    
        const payload: ITour = {
            ...req.body,
            images: (req.files as Express.Multer.File[]).map(file => file.path)
        }
        console.log('from controller: ', payload);
        const result = await TourServices.createTour(payload, decodedToken);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Tour Created Successfully",
            data: result,
        })
    }),
};
