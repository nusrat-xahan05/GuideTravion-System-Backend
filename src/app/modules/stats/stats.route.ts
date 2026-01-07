import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
    "/all-stats", checkAuth(TUserRole.ADMIN), StatsController.getAdminDashboardStats
);

export const StatsRoutes = router;
