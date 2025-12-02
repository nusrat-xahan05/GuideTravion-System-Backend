import { Types } from "mongoose";

// export interface ITourType {
//     name: string;
// }

export enum TTourType {
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

export enum TTourDifficultyLevel {
  EASY = "EASY",
  MODERATE = "MODERATE",
  HARD = "HARD",
}

export enum TTourStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum TTourStatusByAdmin {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ITour {
    _id?: Types.ObjectId;
    title: string;
    slug?: string;
    description: string;

    tourType: TTourType;
    difficultyLevel?: TTourDifficultyLevel;
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
    statusByAdmin: TTourStatusByAdmin;
    averageRating?: number;
    totalReviews?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
