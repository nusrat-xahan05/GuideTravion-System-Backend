// payment.routes.ts
import express from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";

const router = express.Router();


// Tourist initiates payment
router.post("/init", checkAuth(TUserRole.TOURIST), PaymentController.initiatePayment);

// SSLCommerz callbacks
router.post("/success", PaymentController.paymentSuccess);
router.post("/fail", PaymentController.paymentFail);
router.post("/cancel", PaymentController.paymentCancel);

export const PaymentRoutes = router;


// router.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentController.getInvoiceDownloadUrl);
// router.post("/validate-payment", PaymentController.validatePayment)
