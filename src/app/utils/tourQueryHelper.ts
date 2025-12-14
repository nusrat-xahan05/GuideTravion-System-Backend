/* eslint-disable @typescript-eslint/no-explicit-any */
// tourQueryHelper.ts
import mongoose, { PipelineStage } from "mongoose";


export type TourSortField =
    | "durationDays"
    | "pricePerPerson"
    | "rating"
    | "averageRating"
    | "createdAt";

export interface ITourQuery {
    search?: string;
    sortBy?: TourSortField;
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;

    tourType?: string;
    division?: string;
    difficultyLevel?: string;
    statusByAdmin?: string;
    status?: string;

    // used for getMyTour
    createdBy?: string;
}

export interface MetaResponse {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export class TourQueryHelper {
    private query: ITourQuery;

    constructor(query: ITourQuery) {
        this.query = query;
    }

    /** --------------------------
     * BASE LOOKUP PIPELINE
     * ---------------------------*/
    private basePipeline(): PipelineStage[] {
        return [
            {
                $lookup: {
                    from: "guides",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "guide",
                    pipeline: [
                        {
                            $project: {
                                occupation: 1,
                                rating: 1,
                                totalReviews: 1,
                                yearsOfExperience: 1,
                                city: 1,
                                expertise: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: "$guide" },

            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                                profileImage: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: "$user" }
        ];
    }

    /** --------------------------
     * SEARCH
     * title, division, user.email
     * ---------------------------*/
    private buildSearch(): PipelineStage | null {
        const term = this.query.search?.trim();
        if (!term) return null;

        return {
            $match: {
                $or: [
                    { title: { $regex: term, $options: "i" } },
                    { division: { $regex: term, $options: "i" } },
                    { "user.email": { $regex: term, $options: "i" } }
                ]
            }
        };
    }

    /** --------------------------
     * FILTER
     * ---------------------------*/
    private buildFilter(): PipelineStage | null {
        const filter: any = {};

        if (this.query.tourType) filter.tourType = this.query.tourType;
        if (this.query.difficultyLevel) filter.difficultyLevel = this.query.difficultyLevel;
        if (this.query.status) filter.status = this.query.status;
        if (this.query.statusByAdmin) filter.statusByAdmin = this.query.statusByAdmin;

        if (this.query.createdBy) filter.createdBy = new mongoose.Types.ObjectId(this.query.createdBy);
        if (this.query.division) {
        filter.division = { $regex: this.query.division, $options: "i" };
    }
        // if (this.query.createdBy) filter.createdBy = this.query.createdBy;


        return Object.keys(filter).length ? { $match: filter } : null;
    }

    /** --------------------------
     * SORT
     * ---------------------------*/
    private buildSort(): PipelineStage | null {
        if (!this.query.sortBy) return null;

        const order: 1 | -1 = this.query.sortOrder === "asc" ? 1 : -1;

        const sortMap: Record<string, string> = {
            durationDays: "durationDays",
            pricePerPerson: "pricePerPerson",
            rating: "rating",
            averageRating: "averageRating",
            createdAt: "createdAt",
        };

        const field = sortMap[this.query.sortBy];

        if (!field) return null;

        return {
            $sort: {
                [field]: order,
            },
        };
    }

    /** --------------------------
     * PAGINATION
     * ---------------------------*/
    private buildPagination(): {
        page: number;
        limit: number;
        skip: number;
        stage: PipelineStage[];
    } {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const skip = (page - 1) * limit;

        return {
            page,
            limit,
            skip,
            stage: [
                { $skip: skip },
                { $limit: limit }
            ]
        };
    }

    /** --------------------------
     * BUILD FINAL PIPELINE
     * ---------------------------*/
    build() {
        const pipeline: PipelineStage[] = [
            ...this.basePipeline()
        ];

        const search = this.buildSearch();
        if (search) pipeline.push(search);

        const filter = this.buildFilter();
        if (filter) pipeline.push(filter);

        const sort = this.buildSort();
        if (sort) pipeline.push(sort);

        const pagination = this.buildPagination();

        return {
            pipeline,
            pagination
        };
    }

    /** --------------------------
     * META CALCULATION
     * ---------------------------*/
    static calcMeta(total: number, page: number, limit: number): MetaResponse {
        return {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit)
        };
    }
}
