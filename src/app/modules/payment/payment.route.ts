// payment.routes.ts
import express from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";

const router = express.Router();


// Tourist initiates payment
router.post("/init", checkAuth(...Object.values(TUserRole)), PaymentController.initiatePayment);

export const PaymentRoutes = router;

