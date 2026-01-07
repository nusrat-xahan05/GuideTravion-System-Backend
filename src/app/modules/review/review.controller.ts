import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { ReviewService } from "./review.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const ReviewController = {
    // ================= CREATE REVIEW =================
    createReview: catchAsync(async (req: Request, res: Response) => {
        const user = req.user as JwtPayload;

        const result = await ReviewService.createReview(
            req.body,
            user.userId
        );

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Review submitted successfully",
            data: result,
        });
    }),

    // ================= GET REVIEWS BY TOUR =================
    getReviewsByTour: catchAsync(async (req: Request, res: Response) => {
        const { tourId } = req.params;

        const result = await ReviewService.getReviewsByTour(tourId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Reviews fetched successfully",
            data: result,
        });
    }),

    // ================= CHECK ELIGIBILITY =================
    checkEligibility: catchAsync(async (req: Request, res: Response) => {
        const user = req.user as JwtPayload;
        const { tourId } = req.query;

        const result = await ReviewService.checkEligibility(
            tourId as string,
            user.userId
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Reviews fetched successfully",
            data: result,
        });
    }),
};
