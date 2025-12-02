import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourSchema } from "./tour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { TourController } from "./tour.controller";

const router = Router();


// CREATE TOUR ------ (GUIDE ENDPOINT)
router.post( "/create-tour", checkAuth(TUserRole.GUIDE), validateRequest(createTourSchema), TourController.createTour);

// router.patch( "/:id", checkAuth(TUserRole.GUIDE), validateRequest(updateTourSchema), TourController.updateTour);

// router.get( "/my-tours", checkAuth(TUserRole.GUIDE), TourController.getMyTours);


// // ADMIN ROUTES
// router.patch( "/approve/:id", checkAuth(TUserRole.ADMIN), TourController.approveTour);

// router.patch( "/reject/:id", checkAuth(TUserRole.ADMIN), TourController.rejectTour);


// // PUBLIC ROUTES
// router.get("/", TourController.getApprovedTours);
// router.get("/:slug", TourController.getSingleTour);

export const TourRoutes = router;
