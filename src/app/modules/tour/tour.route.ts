import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourSchema, updateTourSchema } from "./tour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();


// CREATE TOUR ------ (GUIDE ENDPOINT)
router.post("/create-tour", checkAuth(TUserRole.ADMIN, TUserRole.GUIDE), multerUpload.array("files"), validateRequest(createTourSchema), TourController.createTour);

// GET ALL TOUR(BY ADMIN) ------ (ADMIN ENDPOINT)
router.get("/all-tours", checkAuth(TUserRole.ADMIN), TourController.getAllTours);

// GET ALL TOUR(BY EACH) ------ (GUIDE ENDPOINT)
router.get("/my-tours", checkAuth(TUserRole.GUIDE), TourController.getMyTours);

// GET ALL ACTIVE+APPROVED TOURS(BY EACH) ------ (GUIDE ENDPOINT)
router.get("/my-active-tours", checkAuth(TUserRole.GUIDE), TourController.getMyActiveTours);

// GET ALL PENDING TOURS TO VERIFY THEM ------ (ADMIN ENDPOINT)
router.get('/pending-tours', checkAuth(TUserRole.ADMIN), TourController.getAllPendingTours);

// GET ALL APPROVED TOUR ------ (PUBLIC ENDPOINT)
router.get("/", TourController.getAllApprovedTours);

// GET SINGLE TOUR ------ (ADMIN, GUIDE ENDPOINT)
router.get("/:slug", TourController.getSingleTour);

// UPDATE TOUR ------ (GUIDE ENDPOINT)
router.patch("/update/:slug", checkAuth(TUserRole.GUIDE), multerUpload.array("files"), validateRequest(updateTourSchema), TourController.updateTour);

// SEND VERIFY REQ------ (GUIDE ENDPOINT)
router.patch("/:slug/send-verify-req", checkAuth(TUserRole.GUIDE), TourController.sendTourVerifyReq);

// APPROVE/REJECT A TOUR ------ (ADMIN ENDPOINT)
router.patch("/:slug/verify-tour", checkAuth(TUserRole.ADMIN), TourController.verifyTour);




export const TourRoutes = router;
