import { model, Schema } from "mongoose";
import { ITour, TTourDifficultyLevel, TTourStatus, TTourStatusByAdmin, TTourType } from "./tour.interface";


const itinerarySchema = new Schema(
    {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        activities: { type: [String], default: [] },
        startTime: { type: String },
        endTime: { type: String },
    },
    { _id: false }
);

const tourSchema = new Schema<ITour>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },

        tourType: {
            type: [String],
            enum: Object.values(TTourType),
            required: true,
        },
        difficultyLevel: {
            type: String,
            enum: Object.values(TTourDifficultyLevel),
            default: TTourDifficultyLevel.EASY,
        },
        status: {
            type: String,
            enum: Object.values(TTourStatus),
            default: TTourStatus.ACTIVE,
        },

        // Location
        location: { type: String, required: true },
        division: { type: String, required: true },

        // Duration & schedule
        durationDays: { type: Number, required: true },
        meetingTime: { type: String },
        pickupLocation: { type: String },
        dropoffLocation: { type: String },

        // Pricing
        pricePerPerson: { type: Number, required: true },
        maxGroupSize: { type: Number, required: true },
        minAge: { type: Number },

        highlights: { type: [String], required: true },
        images: { type: [String], default: [] },
        tags: { type: [String] },

        includes: { type: [String], default: [] },
        excludes: { type: [String], default: [] },

        // Itinerary
        itinerary: { type: [itinerarySchema], default: [] },

        // Created by Guide
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Guide"
        },

        statusByAdmin: {
            type: String,
            enum: Object.values(TTourStatusByAdmin),
            default: TTourStatusByAdmin.REQ_SEND
        },

        // Rating
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    }, {
    timestamps: true,
    versionKey: false,
});


export const TourModel = model<ITour>("Tour", tourSchema);
