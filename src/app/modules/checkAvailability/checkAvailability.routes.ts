import express from "express";
import { CheckAvailabilitySchema } from "./checkAvailability.validation";
import { AvailabilityController } from "./checkAvailability.controller";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/check", validateRequest(CheckAvailabilitySchema), AvailabilityController.check);

export const CheckAvailabilityRoutes = router;
