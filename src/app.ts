import express, { Application, Request, Response } from "express";
import cors from "cors";
// import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
// import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import httpStatus from 'http-status';


const app: Application = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = envVars.FRONTEND_URL.split(",");
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS: " + origin));
            }
        },
        credentials: true,
    })
);

app.use('/api/v1', router);

app.get('/', (_req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        message: "Welcome to GuideTravion System Backend"
    });
})

// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         message: "API NOT FOUND!",
//         error: {
//             path: req.originalUrl,
//             message: "Your requested path is not found!"
//         }
//     })
// })

// app.use(globalErrorHandler);
// app.use(notFound);

export default app;
