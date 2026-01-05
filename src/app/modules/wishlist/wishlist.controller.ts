import { Request, Response } from "express";
import httpStatus from "http-status";
import { WishlistService } from "./wishlist.service";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";



export const WishlistController = {
    async toggleWishlist(req: Request, res: Response) {
        const decodedToken = req.user as JwtPayload;
        const { tourId } = req.body;

        const result = await WishlistService.toggleWishlist(
            decodedToken.userId,
            tourId
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: result.message,
            data: result.wishlistTours,
        });
    },

    async getMyWishlist(req: Request, res: Response) {
        const decodedToken = req.user as JwtPayload;
        const data = await WishlistService.getMyWishlist(decodedToken.userId,);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Your Wishlist Retrieved Successfully",
            data,
        });
    },
};
