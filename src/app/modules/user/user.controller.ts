/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { UserServices } from "./user.service";

export const UserController = {
    registerTourist: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserServices.registerTourist(req.body)

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Tourist Created Successfully",
            data: result,
        })
    }),


    registerGuide: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserServices.registerGuide(req.body)

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Guide Created Successfully",
            data: result,
        })
    })
};

// export const registerTourist = catchAsync(async (req: Request, res: Response) => {
//   const result = await userService.registerTourist(req.body);
//   return sendResponse(res, 201, true, result.message, { user: result.user, tokens: result.tokens });
// });


// export const UserControllers = {
//     createUser
// }
