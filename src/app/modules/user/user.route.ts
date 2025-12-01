import { Router } from "express";
import { registerGuideSchema, registerTouristSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "./user.interface";

const router = Router();


// TOURIST REGISTRATION ------ (TOURIST ENDPOINT)
router.post("/register/tourist", validateRequest(registerTouristSchema), UserController.registerTourist);

// GUIDE REGISTRATION ------ (GUIDE ENDPOINT)
router.post("/register/guide", validateRequest(registerGuideSchema), UserController.registerGuide);

// GET ME USER ------ (USER ENDPOINT)
router.get("/my-profile", checkAuth(...Object.values(TUserRole)), UserController.myProfile);

// GET ALL USERS ------ (ADMIN ENDPOINT)
router.get('/all-users', checkAuth(TUserRole.ADMIN), UserController.getAllUsers);

// GET SINGLE USER ------ (ADMIN ENDPOINT)
router.get("/:id", checkAuth(TUserRole.ADMIN), UserController.getSingleUser);


// router.patch("/:id", authGuard(), validateRequest(UpdateUserSchema), UserController.updateUser);

export const UserRoutes = router
