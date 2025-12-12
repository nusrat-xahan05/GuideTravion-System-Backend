import { z } from "zod";
import { TTourDifficultyLevel, TTourStatus, TTourStatusByAdmin, TTourType } from "./tour.interface";



// Itinerary validation
const itinerarySchema = z.object({
    day: z.number().min(1, "Day number must be at least 1"),
    title: z.string().min(3, "Itinerary title is required"),
    description: z.string().min(5, "Itinerary description is required"),
    activities: z.array(z.string()).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
});

// Tour validation
export const createTourSchema = z.object({
    title: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Title is Required"
                    : "Title Must Be a String",
        })
        .min(3, { message: "Title Must 3 Characters Long" })
        .max(100, { message: "Title is Too Long" }),

    description: z
        .string({
            error: "Description Must Be a String",
        })
        .min(20, { message: "Description Must Be At Least 20 Characters" }),

    slug: z.string().optional(),

    tourType: z
        .array(
            z.enum(
                Object.values(TTourType) as [TTourType, ...TTourType[]],
                {
                    message: "Tour Type is Required"
                }
            )
        )
        .min(1, { message: "Select at least one tour type" }),

    difficultyLevel: z.enum(TTourDifficultyLevel)
        .default(TTourDifficultyLevel.EASY),

    tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
    status: z.enum(TTourStatus).default(TTourStatus.ACTIVE),


    location: z
        .string({
            error: "Location Must Be a String",
        })
        .min(2, "Location Too Short"),

    division: z
        .string({
            error: "Division Must Be a String",
        })
        .min(2, "Division Too Short"),

    durationDays: z
        .number({
            error: "Duration Must Be a Number",
        })
        .min(1, "Duration Must Be At Least 1 Day"),

    meetingTime: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropoffLocation: z.string().optional(),

    pricePerPerson: z
        .number({
            error: "Price Must Be a Number",
        })
        .min(1, "Price Must Be Greater Than 0"),

    maxGroupSize: z
        .number({
            error: "Group Size Must Be a Number",
        })
        .min(1, "Group Size Must Be At Least 1"),

    minAge: z.number().optional(),

    highlights: z
        .array(z.string())
        .min(1, "At Least One Highlight is Required"),

    images: z.array(z.string()).optional(),
    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
    itinerary: z.array(itinerarySchema).optional(),

    createdBy: z.string().optional(),
    statusByAdmin: z.enum(TTourStatusByAdmin).default(TTourStatusByAdmin.REQ_SEND),
    averageRating: z.number().optional(),
    totalReviews: z.number().optional(),
});


// Update Tour validation
export const updateTourSchema = z.object({
    description: z
        .string({
            error: "Description Must Be a String",
        })
        .min(20, { message: "Description Must Be At Least 20 Characters" }),

    tourType: z
        .array(
            z.enum(
                Object.values(TTourType) as [TTourType, ...TTourType[]],
                {
                    message: "Tour Type is Required"
                }
            )
        )
        .min(1, { message: "Select at least one tour type" }),

    difficultyLevel: z.enum(TTourDifficultyLevel)
        .default(TTourDifficultyLevel.EASY),

    tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
    status: z.enum(TTourStatus).default(TTourStatus.ACTIVE),

    pickupLocation: z.string().optional(),
    dropoffLocation: z.string().optional(),

    highlights: z
        .array(z.string())
        .min(1, "At Least One Highlight is Required"),

    images: z.array(z.string()).optional(),
    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
    itinerary: z.array(itinerarySchema).optional(),
});


