/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";


export const AuthController = {
    credentialsLogin: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await AuthServices.credentialsLogin(req.body);

        setAuthCookie(res, result);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Logged In Successfully",
            data: result,
        })
    }),
};
