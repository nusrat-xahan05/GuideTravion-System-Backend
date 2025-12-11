import { ITour, TTourStatusByAdmin } from "./tour.interface";
import { TourModel } from "./tour.model";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/generateSlug";
// import { QueryBuilder } from "../../utils/queryBuilder";
// import { tourSearchableFields, tourSearchableFieldsByAdmin } from "./tour.constant";
import { TUserRole, TVerificationReqStatus } from "../user/user.interface";
import { GuideModel } from "../user/user.model";
import { ITourQuery, TourQueryHelper } from "../../utils/tourQueryHelper";


export const TourServices = {
    // CREATE TOUR ------ (ADMIN, GUIDE ENDPOINT)
    async createTour(payload: Partial<ITour>, decodedToken: JwtPayload) {
        // ---------- STEP 1: REQUIRED VALIDATION ----------
        if (!payload.title) {
            throw new AppError(httpStatus.BAD_REQUEST, "Tour title is required.");
        }

        // ---------- STEP 2: PREPARE COMMON FIELDS ----------
        const slug = await generateUniqueSlug(payload.title);

        // ---------- STEP 3: GET USER ROLE ----------
        const { role, userId } = decodedToken;

        // ---------- STEP 4: ROLE-BASED ACCESS CONTROL ----------
        if (role === TUserRole.GUIDE) {
            // fetch guide
            const guide = await GuideModel.findById(userId);

            if (!guide) {
                throw new AppError(httpStatus.NOT_FOUND, "Guide not found");
            }

            // check verification
            if (guide.verificationRequest !== TVerificationReqStatus.APPROVED) {
                throw new AppError(httpStatus.FORBIDDEN, "You must be an approved guide to create a tour.");
            }
        }

        // ---------- STEP 5: ADMIN & GUIDE STATUS RULE ----------
        let statusByAdmin;
        if (role === TUserRole.ADMIN) {
            statusByAdmin = TTourStatusByAdmin.APPROVED // admin-created tours auto-approved
        } else {
            statusByAdmin = TTourStatusByAdmin.REQ_SEND // guide must send for approval
        }

        // ---------- STEP 6: CREATE TOUR ----------
        const tour = await TourModel.create({
            ...payload,
            slug,
            createdBy: userId,
            statusByAdmin,
        });

        return tour;
    },


    // GET ALL TOUR(BY ADMIN) ------ (ADMIN ENDPOINT)
    async getAllTours(query: ITourQuery) {
        const helper = new TourQueryHelper(query);

        const { pipeline, pagination } = helper.build();

        // total count
        const totalPipeline = [...pipeline, { $count: "total" }];
        const totalRes = await TourModel.aggregate(totalPipeline);
        const total = totalRes[0]?.total || 0;

        // data
        const finalPipeline = [...pipeline, ...pagination.stage];
        const data = await TourModel.aggregate(finalPipeline);

        return {
            data,
            meta: TourQueryHelper.calcMeta(total, pagination.page, pagination.limit)
        };
    },


    // GET ALL TOUR(BY EACH) ------ (GUIDE ENDPOINT)
    async getMyTours(guideId: string, query: ITourQuery) {
        return this.getAllTours({
            ...query,
            createdBy: guideId
        });
    },


    // // GET ALL PENDING TOUR ------ (ADMIN ENDPOINT)
    // async getPendingTours(query: Record<string, string>) {
    //     const queryBuilder = new QueryBuilder(TourModel.find({ statusByAdmin: TTourStatusByAdmin.PENDING }).sort("-createdAt"), query)
    //     const toursData = queryBuilder
    //         .filter()
    //         .search(tourSearchableFieldsByAdmin)
    //         .sort()
    //         .fields()
    //         .paginate();

    //     const [data, meta] = await Promise.all([
    //         toursData.build(),
    //         queryBuilder.getMeta()
    //     ])

    //     return {
    //         data,
    //         meta
    //     }
    // },


    // // GET ALL APPROVED TOUR ------ (PUBLIC ENDPOINT)
    // async getAllApprovedTours(query: Record<string, string>) {
    //     const queryBuilder = new QueryBuilder(TourModel.find({ statusByAdmin: TTourStatusByAdmin.APPROVED, status: "ACTIVE" }).sort("-createdAt"), query)
    //     const toursData = queryBuilder
    //         .filter()
    //         .search(tourSearchableFields)
    //         .sort()
    //         .fields()
    //         .paginate();

    //     const [data, meta] = await Promise.all([
    //         toursData.build(),
    //         queryBuilder.getMeta()
    //     ])

    //     return {
    //         data,
    //         meta
    //     }
    // },

    // GET SINGLE APPROVED TOUR ------ (PUBLIC ENDPOINT)
    async getSingleTour(slug: string) {
        const tour = await TourModel.findOne({
            slug
        });

        if (!tour) {
            throw new AppError(httpStatus.NOT_FOUND, "Tour not found or not approved yet");
        }

        return tour;
    },

    // async getSingleTour(slug: string) {
    //     const tour = await TourModel.findOne({
    //         slug,
    //         statusByAdmin: TTourStatusByAdmin.APPROVED
    //     });

    //     if (!tour) {
    //         throw new AppError(httpStatus.NOT_FOUND, "Tour not found or not approved yet");
    //     }

    //     return tour;
    // },

    // // UPDATE TOUR ------ (GUIDE ENDPOINT)
    // async updateTour(slug: string, guideId: string, payload: Partial<ITour>) {
    //     const tour = await TourModel.findOne({ slug });
    //     if (!tour) {
    //         throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
    //     }

    //     if (tour.createdBy?.toString() !== guideId) {
    //         throw new AppError(httpStatus.FORBIDDEN, "Not authorized to update this tour");
    //     }

    //     // Reset approval status
    //     tour.statusByAdmin = TTourStatusByAdmin.PENDING;

    //     // Add new images
    //     if (payload.images && payload.images.length > 0 && tour.images && tour.images.length > 0) {
    //         payload.images = [...payload.images, ...tour.images]
    //     }

    //     const updatedTour = await TourModel.findOneAndUpdate({ slug }, payload, { new: true });
    //     return updatedTour;
    // },

    // // APPROVE/REJECT A TOUR ------ (ADMIN ENDPOINT)
    // async tourApproval(slug: string, payload: Partial<ITour>) {
    //     const tour = await TourModel.findOne({ slug });
    //     if (!tour) throw new AppError(httpStatus.NOT_FOUND, "Tour not found");

    //     const updatedTour = await TourModel.findOneAndUpdate(
    //         { slug },
    //         { statusByAdmin: payload.statusByAdmin },
    //         { new: true }
    //     );

    //     return updatedTour;
    // },
};
