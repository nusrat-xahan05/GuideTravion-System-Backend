import { z } from "zod";
import { TTourDifficultyLevel, TTourStatus, TTourStatusByAdmin, TTourType } from "./tour.interface";

export const createTourSchema = z.object({
    title: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Title is Required"
                    : "Title Must Be a String",
        })
        .min(3, { message: "Title is Too Short" })
        .max(100, { message: "Title is Too Long" }),

    description: z
        .string({
            error: "Description Must Be a String",
        })
        .min(20, { message: "Description Must Be At Least 20 Characters" }),

    tourType: z.enum(
        Object.values(TTourType) as [TTourType, ...TTourType[]],
        { error: "Invalid Tour Type" }
    ),

    difficultyLevel: z.enum(
        Object.values(TTourDifficultyLevel) as [TTourDifficultyLevel, ...TTourDifficultyLevel[]],
        { error: "Invalid Tour Level" }
    ).optional()
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

    startDate: z
        .string().optional()
        .or(z.date().optional()),

    endDate: z
        .string().optional()
        .or(z.date().optional()),

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
        .array(z.string().min(3, "Highlight Too Short"))
        .min(1, "At Least One Highlight is Required"),

    images: z.array(z.string()).optional(),

    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),

    createdBy: z.string().optional(),
    statusByAdmin: z.enum(TTourStatusByAdmin).default(TTourStatusByAdmin.PENDING),
});
