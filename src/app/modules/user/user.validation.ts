import { z } from "zod";
import { TUserRole, TVerificationReqStatus } from "./user.interface";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const registerBaseUserSchema = z.object({
    firstName: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Name is Required"
                : "Name Must Be a String"
        })
        .min(3, { message: "Name is Too Short" })
        .max(50, { message: "Name is Too Long" }),

    lastName: z
        .string({ error: "LastName Must Be String" })
        .max(200, { message: "lastName Cannot Exceed 8 Characters" })
        .optional(),

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
        .string()
        .min(1, "Phone number is required")
        .refine((value) => {
            const phone = parsePhoneNumberFromString(value);
            return phone?.isValid();
        }, "Invalid phone number in international format (e.g., +14155552671)"),

    country: z.string().min(2, "Country is required"),
});


export const registerTouristSchema = registerBaseUserSchema.extend({
    role: z.enum(TUserRole).default(TUserRole.TOURIST),
});


export const registerGuideSchema = registerBaseUserSchema.extend({
    occupation: z
        .string({
            error: (issue) => issue.input === undefined
                ? "occupation is Required"
                : "occupation Must Be a String"
        })
        .min(2, { message: "occupation is Too Short" })
        .max(30, { message: "occupation is Too Long" }),

    role: z.enum(TUserRole).default(TUserRole.GUIDE),
    verificationRequest: z.enum(TVerificationReqStatus).default(TVerificationReqStatus.NOT_SEND),
});


export const updateBaseUserSchema = z.object({
    firstName: z
        .string()
        .min(3, { message: "Name is Too Short" })
        .max(50, { message: "Name is Too Long" }),

    lastName: z
        .string({ error: "LastName Must Be String" })
        .max(200, { message: "lastName Cannot Exceed 8 Characters" })
        .optional(),

    phone: z
        .string()
        .min(1, "Phone number is required")
        .refine((value) => {
            const phone = parsePhoneNumberFromString(value);
            return phone?.isValid();
        }, "Invalid phone number in international format (e.g., +14155552671)"),

    profileImage: z.string().optional(),
    bio: z.string().optional(),
    country: z.string().min(2, "Country is required").optional(),

    address: z
        .string({ error: "Address Must Be String" })
        .max(200, { message: "Address Cannot Exceed 200 Characters" })
        .optional(),

    languages: z.array(z.string()).optional(),
});


export const updateTouristSchema = updateBaseUserSchema.extend({
    travelInterests: z.array(z.string()).optional(),
    preferredStyles: z.array(z.string()).optional()
});


export const updateGuideSchema = updateBaseUserSchema.extend({
    occupation: z
        .string({
            error: (issue) => issue.input === undefined
                ? "occupation is Required"
                : "occupation Must Be a String"
        })
        .min(2, { message: "occupation is Too Short" })
        .max(30, { message: "occupation is Too Long" }),
    city: z
        .string({
            error: (issue) => issue.input === undefined
                ? "City is Required"
                : "City Must Be a String"
        })
        .min(3, { message: "City is Too Short" })
        .max(16, { message: "City is Too Long" })
        .optional(),
    expertise: z.array(z.string()),
    yearsOfExperience: z.number().optional(),
    hourlyRate: z.number().optional(),
    dailyRate: z.number().optional(),
});


//     userStatus: z
//         .enum(Object.values(TUserStatus) as [TUserStatus, ...TUserStatus[]])
//         .optional()
//         .superRefine((val, ctx) => {
//             if (val && !Object.values(TUserStatus).includes(val)) {
//                 ctx.addIssue({
//                     code: "custom",
//                     message: `Status Must Be 'ACTIVE', 'INACTIVE' or 'BLOCKED'. ${val} is Not Acceptable`,
//                 });
//             }
//         }),

//     isVerified: z
//         .boolean({ error: "Verified Must Be True or False" })
//         .optional(),
// });

// wishlistTours: z.array(z.string()).optional(),
//     bookings: z.array(z.string()).optional(),

//     role: z.enum(TUserRole).default(TUserRole.TOURIST),

// rating: z.number().default(0),
//     totalReviews: z.number().default(0),

//         role: z.enum(TUserRole).default(TUserRole.GUIDE),

