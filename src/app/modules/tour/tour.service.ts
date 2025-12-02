import { ITour, TTourStatusByAdmin } from "./tour.interface";
import { TourModel } from "./tour.model";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/generateSlug";
import { QueryBuilder } from "../../utils/queryBuilder";
import { tourSearchableFields, tourSearchableFieldsByAdmin, tourSearchableFieldsByOwner } from "./tour.constant";


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

    // GET ALL TOUR(BY EACH) ------ (GUIDE ENDPOINT)
    async getMyTours(guideId: string, query: Record<string, string>) {
        const queryBuilder = new QueryBuilder(TourModel.find({ createdBy: guideId }).sort("-createdAt"), query)
        const toursData = queryBuilder
            .filter()
            .search(tourSearchableFieldsByOwner)
            .sort()
            .fields()
            .paginate();

        const [data, meta] = await Promise.all([
            toursData.build(),
            queryBuilder.getMeta()
        ])

        return {
            data,
            meta
        }
    },

    // GET ALL PENDING TOUR ------ (ADMIN ENDPOINT)
    async getPendingTours(query: Record<string, string>) {
        const queryBuilder = new QueryBuilder(TourModel.find({ statusByAdmin: TTourStatusByAdmin.PENDING }).sort("-createdAt"), query)
        const toursData = queryBuilder
            .filter()
            .search(tourSearchableFieldsByAdmin)
            .sort()
            .fields()
            .paginate();

        const [data, meta] = await Promise.all([
            toursData.build(),
            queryBuilder.getMeta()
        ])

        return {
            data,
            meta
        }
    },


    // GET ALL APPROVED TOUR ------ (PUBLIC ENDPOINT)
    async getAllApprovedTours(query: Record<string, string>) {
        const queryBuilder = new QueryBuilder(TourModel.find({ statusByAdmin: TTourStatusByAdmin.APPROVED, status: "ACTIVE" }).sort("-createdAt"), query)
        const toursData = queryBuilder
            .filter()
            .search(tourSearchableFields)
            .sort()
            .fields()
            .paginate();

        const [data, meta] = await Promise.all([
            toursData.build(),
            queryBuilder.getMeta()
        ])

        return {
            data,
            meta
        }
    },

    // GET SINGLE APPROVED TOUR ------ (PUBLIC ENDPOINT)
    async getSingleTour(slug: string) {
        const tour = await TourModel.findOne({
            slug,
            statusByAdmin: TTourStatusByAdmin.APPROVED
        });

        if (!tour) {
            throw new AppError(httpStatus.NOT_FOUND, "Tour not found or not approved yet");
        }

        return tour;
    },

    // UPDATE TOUR ------ (GUIDE ENDPOINT)
    async updateTour(slug: string, guideId: string, payload: Partial<ITour>) {
        const tour = await TourModel.findOne({ slug });
        if (!tour) {
            throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
        }

        if (tour.createdBy?.toString() !== guideId) {
            throw new AppError(httpStatus.FORBIDDEN, "Not authorized to update this tour");
        }

        // Reset approval status
        tour.statusByAdmin = TTourStatusByAdmin.PENDING;

        // Add new images
        if (payload.images && payload.images.length > 0 && tour.images && tour.images.length > 0) {
            payload.images = [...payload.images, ...tour.images]
        }

        const updatedTour = await TourModel.findOneAndUpdate({ slug }, payload, { new: true });
        return updatedTour;
    },

    // APPROVE/REJECT A TOUR ------ (ADMIN ENDPOINT)
    async tourApproval(slug: string, payload: Partial<ITour>) {
        const tour = await TourModel.findOne({ slug });
        if (!tour) throw new AppError(httpStatus.NOT_FOUND, "Tour not found");

        const updatedTour = await TourModel.findOneAndUpdate(
            { slug },
            { statusByAdmin: payload.statusByAdmin },
            { new: true }
        );

        return updatedTour;
    },
};
