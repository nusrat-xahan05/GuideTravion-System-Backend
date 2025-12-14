import { PipelineStage } from "mongoose";

/**
 * Attach tour creator info
 * - Guide professional info
 * - User basic info
 * Result fields: guide, user
 */
export const tourCreatorLookupPipeline: PipelineStage[] = [
    // 🔹 Guide info
    {
        $lookup: {
            from: "guides",
            localField: "createdBy",
            foreignField: "_id",
            as: "guide",
            pipeline: [
                {
                    $project: {
                        occupation: 1,
                        expertise: 1,
                        rating: 1,
                        totalReviews: 1,
                        city: 1,
                        dailyRate: 1,
                        hourlyRate: 1,
                        yearsOfExperience: 1,
                        isVerifiedByAdmin: 1,
                        verificationRequest: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: "$guide",
            preserveNullAndEmptyArrays: true
        }
    },

    // 🔹 User info
    {
        $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user",
            pipeline: [
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        phone: 1,
                        country: 1,
                        languages: 1,
                        address: 1,
                        bio: 1,
                        profileImage: 1,
                        role: 1,
                        userStatus: 1,
                        isVerified: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
        }
    }
];
