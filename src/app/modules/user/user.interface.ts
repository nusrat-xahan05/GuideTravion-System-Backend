import { Types } from "mongoose";

export enum TUserRole {
    TOURIST = "TOURIST",
    GUIDE = "GUIDE",
    ADMIN = "ADMIN"
};

export enum TUserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id?: Types.ObjectId;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    profileImage?: string;
    bio?: string;
    phone?: string;
    address?: string;
    country: string;
    languages?: string[];
    role?: TUserRole;
    userStatus?: TUserStatus;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITourist extends IUser {
    travelInterests?: string[];
    preferredStyles?: string[];
    wishlistTours?: string[];
    bookings?: string[];
}

export interface IGuide extends IUser {
    // NID / Passport Number: string;
    isVerifiedByAdmin?: boolean;
    occupation: string;
    city: string;
    expertise?: string[];
    yearsOfExperience?: number;
    hourlyRate?: number;
    dailyRate?: number;
    rating?: number;
    totalReviews?: number;
    // availability?: any[];
}

