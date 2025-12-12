// payment.validation.ts
import { z } from "zod";

export const CreateSSLSessionSchema = z.object({
    bookingId: z.string(),
});

export const SSLPaymentResponseSchema = z.object({
    status: z.string(),
    tran_id: z.string(),
    val_id: z.string().optional(),
});
