// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Query } from "mongoose";
// import { excludeField } from "../constants";

// export class QueryBuilder<T> {
//     public modelQuery: Query<T[], T>;
//     public readonly query: Record<string, string>

//     constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
//         this.modelQuery = modelQuery;
//         this.query = query;
//     }

//     filter(): this {
//         const filter = { ...this.query }

//         for (const field of excludeField) {
//             // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//             delete filter[field]
//         }

//         this.modelQuery = this.modelQuery.find(filter) // Tour.find().find(filter)
//         return this;
//     }

//     search(searchableField: string[]): this {
//         const searchTerm = this.query.searchTerm || ""
//         const searchQuery = {
//             $or: searchableField.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
//         }
//         this.modelQuery = this.modelQuery.find(searchQuery as any)
//         return this
//     }

//     sort(): this {

//         const sort = this.query.sort || "-createdAt";

//         this.modelQuery = this.modelQuery.sort(sort as any)
//         return this;
//     }

//     fields(): this {

//         const fields = this.query.fields?.split(",").join(" ") || ""

//         this.modelQuery = this.modelQuery.select(fields as any)
//         return this;
//     }

//     paginate(): this {
//         const page = Number(this.query.page) || 1
//         const limit = Number(this.query.limit) || 10
//         const skip = (page - 1) * limit

//         this.modelQuery = this.modelQuery.skip(skip as any).limit(limit as any)
//         return this;
//     }

//     build() {
//         return this.modelQuery
//     }

//     async getMeta() {
//         const totalDocuments = await this.modelQuery.model.countDocuments()

//         const page = Number(this.query.page) || 1
//         const limit = Number(this.query.limit) || 10

//         const totalPage = Math.ceil(totalDocuments / limit)

//         return { page, limit, total: totalDocuments, totalPage }
//     }
// }



import { Query } from "mongoose";
import { excludeField } from "../constants";


export class QueryBuilder<T> {
    constructor(
        public modelQuery: Query<T[], T>,
        public query: Record<string, string>
    ) { }

    filter(): this {
        const filter = { ...this.query };
        for (const key of excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[key];
        }

        this.modelQuery = this.modelQuery.where(filter);
        return this;
    }

    search(fields: string[]): this {
        const term = this.query.searchTerm;
        if (!term) return this;

        const regex = { $regex: term, $options: "i" };
        const or = fields.map(f => ({ [f]: regex }));

        this.modelQuery = this.modelQuery.find({ $or: or });
        return this;
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    fields(): this {
        if (this.query.fields) {
            this.modelQuery = this.modelQuery.select(
                this.query.fields.split(",").join(" ")
            );
        }
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
        const total = await this.modelQuery.model.countDocuments();

        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        return {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit)
        };
    }
}
