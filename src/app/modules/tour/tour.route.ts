// // tour.route.ts
// import { Router } from "express";
// import { createTourSchema } from "./tour.validation";
// import { validateRequest } from "../../middlewares/validateRequest";
// import { checkAuth } from "../../middlewares/checkAuth";
// import { TUserRole } from "../user/user.interface";
// import { TourController } from "./tour.controller";

// const router = Router();

// // GUIDE: create tour listing
// router.post(
//     "/create",
//     checkAuth(TUserRole.GUIDE),
//     validateRequest(createTourSchema),
//     TourController.createTour
// );

// // PUBLIC: get all tours
// router.get("/", TourController.getAllTours);

// // PUBLIC: get single tour
// router.get("/:id", TourController.getSingleTour);

// // ADMIN: approve tour
// router.patch(
//     "/approve/:id",
//     checkAuth(TUserRole.ADMIN),
//     TourController.approveTour
// );

// export const TourRoutes = router;
