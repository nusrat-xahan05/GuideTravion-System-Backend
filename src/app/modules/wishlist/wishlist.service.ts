import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { TouristModel } from "../user/user.model";


export const WishlistService = {
    async toggleWishlist(touristId: string, tourId: string) {
        const tourist = await TouristModel.findById(touristId);
        if (!tourist) {
            throw new AppError(httpStatus.NOT_FOUND, "Tourist not found");
        }

        const exists = tourist?.wishlistTours?.some(
            id => id.toString() === tourId
        );

        if (exists) {
            tourist.wishlistTours = tourist?.wishlistTours?.filter(
                id => id.toString() !== tourId
            );
        } else {
            tourist?.wishlistTours?.push(
                new Types.ObjectId(tourId)
            );
        }

        await tourist.save();

        return {
            message: exists
                ? "Tour Removed From Wishlist Successfully"
                : "Tour Added to Wishlist Successfully",
            wishlistTours: tourist.wishlistTours,
        };
    },

    async getMyWishlist(touristId: string) {
        return TouristModel.findById(touristId)
            .select("wishlistTours")
            .populate("wishlistTours");
    },
};
