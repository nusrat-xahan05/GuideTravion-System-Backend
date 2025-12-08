/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

export const UserController = {
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
    }),

    // GET ALL USERS ------ 
    getAllGuides: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const result = await UserServices.getAllGuides(query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Guides Retrieved Successfully",
            data: result.data,
            meta: result.meta
        })
    }),

    // getAllTourists: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //     const query = req.query;
    //     const result = await UserServices.getAllTourists(query as Record<string, string>);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: "Tourists Retrieved Successfully",
    //         data: result.data,
    //         meta: result.meta
    //     })
    // }),


    // SEND VERIFICATION REQUEST ------ (GUIDE ENDPOINT)
    sendVerifyReq: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload
        const result = await UserServices.sendVerifyReq(decodedToken.userId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Verification Request Sent Successfully",
            data: result.data
        })
    }),

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

    // UPDATE USER PROFILE BY ID ------ (USER ENDPOINT)
    updateProfile: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload
        const payload = {
            ...req.body,
            profileImage: req.file?.path
        }
        const result = await UserServices.updateProfile(decodedToken.userId, payload);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Profile Updated Successfully",
            data: result
        })
    }),

    // GET SINGLE USER ------
    getSingleUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const result = await UserServices.getSingleUser(userId);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Retrieved Successfully",
            data: result.data
        })
    }),

    // UPDATE SINGLE USER ------ (ADMIN ENDPOINT)
    updateSingleUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const result = await UserServices.updateSingleUser(userId, req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Profile Updated Successfully",
            data: result
        })
    }),
};
