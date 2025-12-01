import { Router } from "express";
import { createTouristSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";

const router = Router();


router.post("/register/tourist", validateRequest(createTouristSchema), UserController.registerTourist);
// router.post("/register/guide", validateRequest(createGuideSchema), UserController.registerGuide);
// router.get("/me", authGuard(), UserController.getMe);
// router.get("/", authGuard(["admin"]), UserController.listUsers);
// router.get("/:id", authGuard(), UserController.getUser);
// router.patch("/:id", authGuard(), validateRequest(UpdateUserSchema), UserController.updateUser);

export const UserRoutes = router
