/* eslint-disable @typescript-eslint/no-explicit-any */
import { PipelineStage, Types } from "mongoose";
import { TBookingStatus } from "../modules/booking/booking.interface";
import { TUserRole } from "../modules/user/user.interface";

export interface IBookingQuery {
    page?: string;
    limit?: string;
    sort?: string;
    search?: string;
    tourist?: string;
    guide?: string;

    status?: TBookingStatus;
    isReviewed?: string; // "true" | "false"
    upcoming?: string;
    active?: string;
}

export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
}

export class BookingQueryHelper {
    constructor(
        private query: IBookingQuery,
        private userId: string,
        private role: TUserRole
    ) { }

    /* ---------------- BASE MATCH ---------------- */
    baseMatch(): PipelineStage {
        const match: any = {};
        const nowDate = new Date();

        if (this.role === TUserRole.TOURIST) {
            match.touristId = new Types.ObjectId(this.userId);
        }

        if (this.role === TUserRole.GUIDE) {
            match.guideId = new Types.ObjectId(this.userId);
        }

        if (this.query.status) {
            match.status = this.query.status;
        }

        if (this.query.isReviewed !== undefined) {
            match.isReviewed = this.query.isReviewed === "true";
        }

        if (this.query.upcoming === "true") {
            match.startDate = { $gt: nowDate };
        }        

        if (this.query.active === "true") {
            match.startDate = { $lte: nowDate };
            match.endDate = { $gte: nowDate };
            // match.status = TBookingStatus.CONFIRMED;
        }

        return { $match: match };
    }

    /* ---------------- LOOKUPS ---------------- */
    lookups(): PipelineStage[] {
        return [
            {
                $lookup: {
                    from: "tours",
                    localField: "tourId",
                    foreignField: "_id",
                    as: "tour",
                },
            },
            { $unwind: "$tour" },

            {
                $lookup: {
                    from: "users",
                    localField: "touristId",
                    foreignField: "_id",
                    as: "tourist",
                },
            },
            { $unwind: "$tourist" },

            {
                $lookup: {
                    from: "guides",
                    localField: "guideId",
                    foreignField: "_id",
                    as: "guide",
                },
            },
            { $unwind: "$guide" },

            {
                $lookup: {
                    from: "users",
                    localField: "guide._id",
                    foreignField: "_id",
                    as: "guideUser",
                },
            },
            { $unwind: "$guideUser" },
        ];
    }

    /* ---------------- SEARCH ---------------- */
    fieldFilters(): PipelineStage | null {
        const match: any = {};

        if (this.query.tourist) {
            match["tourist.email"] = {
                $regex: this.query.tourist,
                $options: "i",
            };
        }

        if (this.query.guide) {
            match["guideUser.email"] = {
                $regex: this.query.guide,
                $options: "i",
            };
        }

        return Object.keys(match).length ? { $match: match } : null;
    }


    search(): PipelineStage | null {
        const term = this.query.search?.trim();
        if (!term) return null;

        return {
            $match: {
                $or: [
                    { "tour.title": { $regex: term, $options: "i" } },
                    { "tour.division": { $regex: term, $options: "i" } },
                    { "tourist.email": { $regex: term, $options: "i" } },
                    { "guideUser.email": { $regex: term, $options: "i" } },
                ],
            },
        };
    }

    /* ---------------- SORT ---------------- */
    sort(): PipelineStage {
        const sortField = this.query.sort?.replace("-", "") || "createdAt";
        const sortOrder: 1 | -1 = this.query.sort?.startsWith("-") ? -1 : 1;

        const allowed = ["createdAt", "completedAt"];
        if (!allowed.includes(sortField)) {
            return { $sort: { createdAt: -1 } };
        }

        return {
            $sort: {
                [sortField]: sortOrder,
            },
        };
    }

    /* ---------------- PAGINATION ---------------- */
    pagination(): PaginationResult {
        const page = Math.max(Number(this.query.page) || 1, 1);
        const limit = Math.max(Number(this.query.limit) || 10, 1);
        const skip = (page - 1) * limit;

        return { page, limit, skip };
    }
}
