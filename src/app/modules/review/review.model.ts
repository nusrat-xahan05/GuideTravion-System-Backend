import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
    {
        tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
        touristId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        guideId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String },
    },
    { timestamps: true, versionKey: false }
);

export const ReviewModel = model<IReview>("Review", reviewSchema);
