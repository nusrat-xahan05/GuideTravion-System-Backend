import { z } from "zod";

export const CheckAvailabilitySchema = z.object({
    query: z.object({
        tourId: z.string(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        persons: z.coerce.number().min(1),
    }),
});

export type TCheckAvailabilityRequest = z.infer<typeof CheckAvailabilitySchema>;
