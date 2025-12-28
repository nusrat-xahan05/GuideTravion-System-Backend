import { Types } from "mongoose";

export interface IReview {
    _id?: Types.ObjectId;

    tourId: Types.ObjectId;
    bookingId: Types.ObjectId;
    touristId: Types.ObjectId;
    guideId: Types.ObjectId;

    rating: number; // 1 - 5
    review?: string;

    createdAt?: Date;
}
