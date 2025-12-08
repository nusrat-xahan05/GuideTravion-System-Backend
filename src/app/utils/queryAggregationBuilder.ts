/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T> {
    public modelQuery: any;
    public readonly query: Record<string, string>;

    constructor(modelQuery: any, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter(): this {
        const queryObj = { ...this.query };

        // Remove fields not related to filtering
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        excludeField.forEach((field) => delete queryObj[field]);

        const filter: Record<string, any> = {};

        for (const key in queryObj) {
            // comparison operator support (e.g., yearsOfExperience_gte)
            if (key.includes("_")) {
                const [field, operator] = key.split("_");
                const value = queryObj[key];

                const mongoOpMap: any = {
                    gte: "$gte",
                    lte: "$lte",
                    gt: "$gt",
                    lt: "$lt",
                };

                if (!filter[field]) filter[field] = {};
                filter[field][mongoOpMap[operator]] = value;
            } else {
                // normal field: value filter
                filter[key] = queryObj[key];
            }
        }

        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }

    search(searchableFields: string[]): this {
        const searchTerm = this.query.searchTerm || "";
        if (!searchTerm) return this;

        const searchQuery = {
            $or: searchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        };

        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    fields(): this {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    build() {
        return this.modelQuery;
    }

    async meta() {
        const totalDocs = await this.modelQuery.model.countDocuments();

        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(totalDocs / limit);

        return { page, limit, total: totalDocs, totalPage };
    }
}
