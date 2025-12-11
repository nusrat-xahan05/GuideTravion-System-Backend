import { Types } from "mongoose";

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
  BEACH = "BEACH",
  WILDLIFE = "WILDLIFE",
  RELIGIOUS = "RELIGIOUS",
  MOUNTAIN = "MOUNTAIN",
  WATERFALL = "WATERFALL",
  HERITAGE = "HERITAGE",
  FESTIVAL = "FESTIVAL",
  BOAT_RIDE = "BOAT_RIDE",
  SCUBA_DIVING = "SCUBA_DIVING",
  FARM_LIFE = "FARM_LIFE",
  RURAL_EXPERIENCE = "RURAL_EXPERIENCE",
  SAFARI = "SAFARI",
  CAMPING = "CAMPING",
  WINTER_SPORTS = "WINTER_SPORTS",
  ECO_TOURISM = "ECO_TOURISM"
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
  REQ_SEND = "SEND REQUEST",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ITour {
  _id?: Types.ObjectId;

  // Basic Info
  title: string;
  slug?: string;
  description: string;
  tourType: TTourType[]; // adventure, sightseeing, hiking etc.
  difficultyLevel?: TTourDifficultyLevel;
  tags?: string[];
  status?: TTourStatus; // draft, published, archived

  // Location
  location: string; // city, area
  division: string;

  // Duration & Schedule
  durationDays: number;
  meetingTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;

  // Pricing & Capacity
  pricePerPerson: number;
  maxGroupSize: number;
  minAge?: number;

  // Tour Content
  highlights: string[];
  images?: string[];

  // Included / Excluded
  includes?: string[];
  excludes?: string[];

  // Itinerary
  itinerary?: {
    day: number;              // Day 1, Day 2...
    title: string;            // “Arrival & Beach Exploration”
    description: string;      // Summary of that day
    activities: string[];     // List of activities
    startTime?: string;       // Optional
    endTime?: string;         // Optional
  }[];

  // Admin & Guide Info
  createdBy: {
    type: Types.ObjectId,
    ref: "Guide",
    required: true
  }  // guideId
  statusByAdmin: TTourStatusByAdmin;

  // Ratings
  averageRating?: number;
  totalReviews?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

