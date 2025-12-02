import { model, Schema, Types } from "mongoose";
import { ITour, TourTypeEnum, TTourStatus } from "./tour.interface";

const TourSchema = new Schema<ITour>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },

        tourType: {
            type: String,
            enum: Object.values(TourTypeEnum),
            required: true,
        },
        difficultyLevel: {
            type: String,
            enum: ["EASY", "MODERATE", "HARD"],
            default: "EASY",
        },
        tags: { type: [String] },
        status: {
            type: String,
            enum: Object.values(TTourStatus),
            default: TTourStatus.ACTIVE,
        },

        location: { type: String, required: true },
        division: { type: String, required: true },
        durationDays: { type: Number, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        meetingTime: { type: String },
        pickupLocation: { type: String },
        dropoffLocation: { type: String },

        pricePerPerson: { type: Number, required: true },
        maxGroupSize: { type: Number, required: true },
        minAge: { type: Number },
        highlights: { type: [String], required: true },
        images: { type: [String], default: [] },

        includes: { type: [String], default: [] },
        excludes: { type: [String], default: [] },

        createdBy: { type: Types.ObjectId, ref: "GuideModel", required: true },
        isApproved: { type: Boolean, default: false },
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const TourModel = model<ITour>("Tour", TourSchema);
