import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest = (zodSchema: ZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    console.log('from req.body: ', req.body);

    try {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }

        req.body = await zodSchema.parseAsync(req.body)
        next()
    } catch (err) {
        next(err)
    }
}

// import { NextFunction, Request, Response } from "express";
// import { ZodObject } from "zod";

// const validateRequest = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const parsed = await schema.parseAsync({
//             body: req.body,
//             query: req.query,
//             params: req.params,
//         });

//         // assign parsed values back
//         if (parsed.body) req.body = parsed.body;
//         if (parsed.query) req.query = parsed.query;
//         if (parsed.params) req.params = parsed.params;

//         next();
//     } catch (error) {
//         next(error);
//     }
// };

// export default validateRequest;
