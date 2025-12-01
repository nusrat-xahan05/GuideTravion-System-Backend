import { z } from "zod";
import { TUserRole, TUserStatus } from "./user.interface";

export const BaseUserSchema = z.object({
    name: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Name is Required"
                : "Name Must Be a String"
        })
        .min(3, { message: "Name is Too Short" })
        .max(50, { message: "Name is Too Long" }),

    email: z
        .email({ message: "Invalid Email Address Format" })
        .regex(
            // eslint-disable-next-line no-useless-escape
            /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
            { message: "Invalid Email Address Format" }
        )
        .transform((val) => val.toLowerCase()),

    password: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Password is Required"
                : "Password Must Be a String"
        })
        .min(8, { message: "Password Must Be At Least 8 Characters Long" })
        .regex(/^(?=.*[A-Z])/, { message: "Password Must Contain At Least 1 Uppercase Letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password Must Contain At Least 1 Special Character" })
        .regex(/^(?=.*\d)/, { message: "Password Must Contain At Least 1 Number" }),

    phone: z
        .string({ error: "Phone Number Must Be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" })
        .optional(),

    address: z
        .string({ error: "Address Must Be String" })
        .max(200, { message: "Address Cannot Exceed 200 Characters" })
        .optional(),

    profileImage: z.string().optional(),

    bio: z.string().optional(),

    country: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Country is Required"
                : "Country Must Be a String"
        })
        .min(2, { message: "Country is Too Short" })
        .max(50, { message: "Country is Too Long" }),

    languages: z.array(z.string()).optional(),

    userStatus: z
        .enum(Object.values(TUserStatus) as [TUserStatus, ...TUserStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(TUserStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Status Must Be 'ACTIVE', 'INACTIVE' or 'BLOCKED'. ${val} is Not Acceptable`,
                });
            }
        }),

    isVerified: z
        .boolean({ error: "Verified Must Be True or False" })
        .optional(),

    // role: z.enum(TUserRole).optional(),
});



export const createTouristSchema = BaseUserSchema.extend({
    travelInterests: z.array(z.string()).optional(),
    preferredStyles: z.array(z.string()).optional(),
    wishlistTours: z.array(z.string()).optional(),
    bookings: z.array(z.string()).optional(),

    role: z.enum(TUserRole).default(TUserRole.TOURIST),
});



export const createGuideSchema = BaseUserSchema.extend({
    expertise: z.array(z.string()),
    yearsOfExperience: z.number().optional(),
    hourlyRate: z.number().optional(),
    dailyRate: z.number().optional(),
    rating: z.number().default(0),
    totalReviews: z.number().default(0),

    role: z.enum(TUserRole).default(TUserRole.GUIDE),
});

