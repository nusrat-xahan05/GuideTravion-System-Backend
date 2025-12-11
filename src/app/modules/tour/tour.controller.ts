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
        const result = await TourServices.createTour(payload, decodedToken);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Tour Created Successfully",
            data: result,
        })
    }),

    // GET ALL TOUR(BY ADMIN) ------ (ADMIN ENDPOINT)
    getAllTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const result = await TourServices.getAllTours(query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All tours retrieved successfully",
            data: result.data,
            meta: result.meta
        });
    }),

    // GET ALL TOUR(BY EACH) ------ (GUIDE ENDPOINT)
    getMyTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        const query = req.query;
        const result = await TourServices.getMyTours(decodedToken.userId, query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "My tours retrieved successfully",
            data: result.data,
            meta: result.meta
        });
    }),

    // // GET ALL PENDING TOUR ------ (ADMIN ENDPOINT)
    // getPendingTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //     const query = req.query;
    //     const result = await TourServices.getPendingTours(query as Record<string, string>);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: "Pending tours retrieved",
    //         data: result,
    //     });
    // }),

    // // GET ALL APPROVED TOUR ------ (PUBLIC ENDPOINT)
    // getAllApprovedTours: catchAsync(async (req: Request, res: Response) => {
    //     const query = req.query;
    //     const result = await TourServices.getAllApprovedTours(query as Record<string, string>);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: "Tours fetched successfully",
    //         data: result,
    //     });
    // }),

    // GET SINGLE APPROVED TOUR ------ (PUBLIC ENDPOINT)
    getSingleTour: catchAsync(async (req: Request, res: Response) => {
        const result = await TourServices.getSingleTour(req.params.slug);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Single tour fetched successfully",
            data: result,
        });
    }),

    // // UPDATE TOUR ------ (GUIDE ENDPOINT)
    // updateTour: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //     const slug = req.params.slug;
    //     const decodedToken = req.user as JwtPayload;

    //     const updatedData = {
    //         ...req.body,
    //         images: (req.files as Express.Multer.File[]).map(file => file.path)
    //     };

    //     const result = await TourServices.updateTour(slug, decodedToken.userId, updatedData);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: "Tour updated successfully (awaiting re-approval)",
    //         data: result,
    //     });
    // }),


    // // APPROVE/REJECT A TOUR ------ (ADMIN ENDPOINT)
    // tourApproval: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //     const result = await TourServices.tourApproval(req.params.slug, req.body);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: "Tour approved successfully",
    //         data: result,
    //     });
    // }),
};
