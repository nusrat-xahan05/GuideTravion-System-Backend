import express from "express";
// import { CheckAvailabilitySchema } from "./checkAvailability.validation";
import { AvailabilityController } from "./checkAvailability.controller";
// import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";

const router = express.Router();

router.get("/check", 
    checkAuth(...Object.values(TUserRole)), 
    AvailabilityController.check);

export const CheckAvailabilityRoutes = router;
