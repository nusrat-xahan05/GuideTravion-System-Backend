/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

export const UserController = {
    // TOURIST REGISTRATION ------ (TOURIST ENDPOINT)
    registerTourist: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserServices.registerTourist(req.body)

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Tourist Created Successfully",
            data: result,
        })
    }),


    // GUIDE REGISTRATION ------ (GUIDE ENDPOINT)
    registerGuide: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserServices.registerGuide(req.body)

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Guide Created Successfully",
            data: result,
        })
    }),


    // GET ME USER ------ (USER ENDPOINT)
    myProfile: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload
        const result = await UserServices.myProfile(decodedToken.userId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Your Profile Retrieved Successfully",
            data: result.data
        })
    })
};
