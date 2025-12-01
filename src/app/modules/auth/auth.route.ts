import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { userLoginSchema } from "./auth.validaton";


const router = Router();


router.post("/login", validateRequest(userLoginSchema), AuthController.credentialsLogin);
// router.post("/logout", AuthController.logout);

export const AuthRoutes = router