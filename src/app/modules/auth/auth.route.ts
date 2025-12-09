import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { userLoginSchema } from "./auth.validaton";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";


const router = Router();


// GET USER BASIC INFO ------
router.get("/me", checkAuth(...Object.values(TUserRole)), AuthController.getMe);

// USER LOGIN ------
router.post("/login", validateRequest(userLoginSchema), AuthController.credentialsLogin);

// USER LOGOUT ------
router.post("/logout", AuthController.logout);

// USER PASSWORD CHANGE ------
router.post('/change-password', checkAuth(...Object.values(TUserRole)), AuthController.changePassword);


export const AuthRoutes = router