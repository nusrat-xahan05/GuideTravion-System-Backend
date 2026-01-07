import { Request, Response } from "express";
import httpStatus from "http-status";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";

export const StatsController = {
    async getAdminDashboardStats(req: Request, res: Response) {
        const result = await StatsService.getAdminDashboardStats();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin dashboard stats fetched successfully",
            data: result,
        });
    },
};
