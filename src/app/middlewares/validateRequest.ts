import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest = (zodSchema: ZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        console.log('from validator: ', req);
        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }

        req.body = await zodSchema.parseAsync(req.body)
        next()
    } catch (err) {
        next(err)
    }
}