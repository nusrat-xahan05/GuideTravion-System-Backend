import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { WishlistController } from "./wishlist.controller";


const router = Router();


router.get("/myWishlist", checkAuth(TUserRole.TOURIST), WishlistController.getMyWishlist);
router.post("/toggleWishlist", checkAuth(TUserRole.TOURIST), WishlistController.toggleWishlist);


export const WishlistRoutes = router;

