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


    // GET ALL ACTIVE+APPROVED TOURS(BY EACH) ------ (GUIDE ENDPOINT)
    getMyActiveTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        const query = req.query;
        const result = await TourServices.getMyActiveTours(decodedToken.userId, query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "My active tours retrieved successfully",
            data: result.data,
            meta: result.meta
        });
    }),


    // GET TOP 6 TOURS ------ (PUBLIC ENDPOINT)
    getTopTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const limit = Number(req.query.limit) || 3;
        const result = await TourServices.getTopTours(limit);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Top Tours retrieved ",
            data: result
        });
    }),


    // GET ALL PENDING TOUR ------ (ADMIN ENDPOINT)
    getAllPendingTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const result = await TourServices.getAllPendingTours(query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Pending tours retrieved",
            data: result,
        });
    }),


    // GET ALL APPROVED TOUR ------ (PUBLIC ENDPOINT)
    getAllApprovedTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const result = await TourServices.getAllApprovedTours(query as Record<string, string>);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tours fetched successfully",
            data: result,
        });
    }),

    // GET TOUR COUNT BASED ON DIVISION ------ (PUBLIC ENDPOINT)
    getTourCountByDivision: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TourServices.getTourCountByDivision();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tours By Each Division Retrived successfully",
            data: result,
        });
    }),

    // GET NEWLY APPROVED TOURS ------- (PUBLIC ENDPOINT)
    getNewApprovedTours: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const limit = Number(req.query.limit) || 6;
        const result = await TourServices.getNewApprovedTours(limit);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "New Tours Retrived successfully",
            data: result,
        });
    }),


    // GET SINGLE APPROVED TOUR ------ (PUBLIC ENDPOINT)
    getSingleTour: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TourServices.getSingleTour(req.params.slug);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Single tour fetched successfully",
            data: result,
        });
    }),


    // UPDATE TOUR ------ (GUIDE ENDPOINT)
    updateTour: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const slug = req.params.slug;
        const decodedToken = req.user as JwtPayload;

        const updatedData = {
            ...req.body,
            images: (req.files as Express.Multer.File[]).map(file => file.path)
        };

        const result = await TourServices.updateTour(slug, decodedToken.userId, updatedData);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour updated successfully (awaiting re-approval)",
            data: result,
        });
    }),


    // APPROVE/REJECT A TOUR ------ (ADMIN ENDPOINT)
    verifyTour: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TourServices.verifyTour(req.params.slug, req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour approved successfully",
            data: result,
        });
    }),


    // SEND VERIFY REQ------ (GUIDE ENDPOINT)
    sendTourVerifyReq: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TourServices.sendTourVerifyReq(req.params.slug);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Request Send Successfully",
            data: result,
        });
    }),

    deleteTourBySlug: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { slug } = req.params;
        const decodedToken = req.user;

        const result = await TourServices.deleteTourBySlug(slug, decodedToken.userId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Tour deleted successfully",
            data: result,
        });
    })
};