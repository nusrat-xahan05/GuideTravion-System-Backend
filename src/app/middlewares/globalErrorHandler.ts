import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import { handleValidationError } from "../errorHelpers/handleValidationError";
import { handleZodError } from "../errorHelpers/handleZodError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError";
import { TErrorSources } from "../types/error.types";
// import { deleteImageFromCLoudinary } from "../config/cloudinary.config";


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "Development") {
        console.log(err);
    }

    // console.log({ file: req.files });
    // if (req.file) {
    //     await deleteImageFromCLoudinary(req.file.path)
    // }

    // if (req.files && Array.isArray(req.files) && req.files.length) {
    //     const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

    //     await Promise.all(imageUrls.map(url => deleteImageFromCLoudinary(url)))
    // }

    let errorSources: TErrorSources[] = [];
    let statusCode = 500;
    let message = `Something Went Wrong!!`;

    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === 'CastError') {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === 'ZodError') {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    }
    else if (err.name === 'ValidationError') {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === 'Development' ? err : null,
        stack: envVars.NODE_ENV === 'Development' ? err.stack : null
    })
}