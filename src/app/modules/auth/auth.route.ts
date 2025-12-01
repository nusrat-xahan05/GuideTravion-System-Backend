import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { userLoginSchema } from "./auth.validaton";


const router = Router();


// USER LOGIN ------
router.post("/login", validateRequest(userLoginSchema), AuthController.credentialsLogin);

// USER LOGOUT ------
router.post("/logout", AuthController.logout);

export const AuthRoutes = router