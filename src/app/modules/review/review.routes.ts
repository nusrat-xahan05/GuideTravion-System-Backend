import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { ReviewController } from "./review.controller";

const router = express.Router();

// Create review (Tourist only)
router.post("/", checkAuth(TUserRole.TOURIST), ReviewController.createReview);

// Get reviews by tour
router.get("/tour/:tourId", ReviewController.getReviewsByTour);

// Check review eligibility
router.get("/eligibility", checkAuth(TUserRole.TOURIST), ReviewController.checkEligibility);


export const ReviewRoutes = router;
