import { ITour } from "./tour.interface";
import { TourModel } from "./tour.model";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/generateSlug";


export const TourServices = {
    // CREATE TOUR ------ (GUIDE ENDPOINT)
    async createTour(payload: Partial<ITour>, decodedToken: JwtPayload) {
        if (!payload.title) {
            throw new AppError(httpStatus.BAD_REQUEST, "Tour title is required.");
        }

        const slug = await generateUniqueSlug(payload.title);

        const tour = await TourModel.create({
            ...payload,
            slug,
            createdBy: decodedToken.userId
        });

        return tour;
    },
};
