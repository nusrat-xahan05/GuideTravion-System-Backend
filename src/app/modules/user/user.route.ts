import { Router } from "express";
import { registerGuideSchema, registerTouristSchema, updateGuideSchema, updateTouristSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();


// GET ME USER ------ (USER ENDPOINT)
router.get("/my-profile", checkAuth(...Object.values(TUserRole)), UserController.myProfile);

// GET ALL Guides ------ (ADMIN ENDPOINT)
router.get('/all-guides', checkAuth(TUserRole.ADMIN), UserController.getAllGuides);

// GET ALL PENDING GUIDES TO VERIFY THEM ------ (ADMIN ENDPOINT)
router.get('/verify-guides', checkAuth(TUserRole.ADMIN), UserController.getAllPendingGuides);

// GET ALL Tourists ------ (ADMIN ENDPOINT)
router.get('/all-tourists', checkAuth(TUserRole.ADMIN), UserController.getAllTourists);

// SEND VERIFICATION REQUEST ------ (GUIDE ENDPOINT)
router.post('/send-verify', checkAuth(TUserRole.GUIDE), UserController.sendVerifyReq);

// TOURIST REGISTRATION ------ (TOURIST ENDPOINT)
router.post("/register/tourist", validateRequest(registerTouristSchema), UserController.registerTourist);

// GUIDE REGISTRATION ------ (GUIDE ENDPOINT)
router.post("/register/guide", validateRequest(registerGuideSchema), UserController.registerGuide);

// UPDATE USER PROFILE BY ID ------ (USER ENDPOINT)
router.patch("/update-profile", checkAuth(...Object.values(TUserRole)), multerUpload.single("file"), (req, res, next) => {
    const role = req.user.role;
    const schema =
        role === "GUIDE"
            ? updateGuideSchema
            : updateTouristSchema;

    return validateRequest(schema)(req, res, next);
}, UserController.updateProfile);


// APPROVE/REJECT GUIDE VERIFICATION STATUS ------ (ADMIN ENDPOINT)
router.patch("/:id/verify", checkAuth(TUserRole.ADMIN), UserController.verifyGuideController);

// GET SINGLE USER ------ (ADMIN ENDPOINT)
router.get("/:id", checkAuth(TUserRole.ADMIN), UserController.getSingleUser);

// UPDATE SINGLE USER ------ (ADMIN ENDPOINT)
router.patch("/:id", checkAuth(TUserRole.ADMIN), UserController.updateSingleUser);


export const UserRoutes = router
