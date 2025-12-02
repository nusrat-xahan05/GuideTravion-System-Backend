import { Types } from "mongoose";

// export interface ITourType {
//     name: string;
// }

export enum TourTypeEnum {
    ADVENTURE = "ADVENTURE",
    ART = "ART",
    CULTURAL = "CULTURAL",
    HIKING = "HIKING",
    FOOD = "FOOD",
    HISTORICAL = "HISTORICAL",
    CITY_TOUR = "CITY_TOUR",
    NIGHTLIFE = "NIGHTLIFE",
    PHOTOGRAPHY = "PHOTOGRAPHY",
}

export enum TTourStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface ITour {
    _id?: Types.ObjectId;
    title: string;
    slug?: string;
    description: string;

    tourType: TourTypeEnum;
    difficultyLevel?: "EASY" | "MODERATE" | "HARD";
    tags?: string[];
    status?: TTourStatus; 
    // tourType: Types.ObjectId

    location: string;
    division: string;
    durationDays: number;
    startDate?: Date
    endDate?: Date;
    meetingTime?: string;
    pickupLocation?: string;
    dropoffLocation?: string;

    pricePerPerson: number;
    maxGroupSize: number;
    minAge?: number;
    highlights: string[];
    images?: string[];
    // deleteImages?: string[]

    includes?: string[];
    excludes?: string[];

    createdBy?: Types.ObjectId;
    isApproved: boolean;
    averageRating?: number;
    totalReviews?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
