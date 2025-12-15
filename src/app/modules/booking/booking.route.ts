import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";


const router = express.Router();

// Create booking (tourist only)
router.post("/", checkAuth(...Object.values(TUserRole)), validateRequest(createBookingSchema), BookingController.createBooking);

// List bookings (admin/guide/tourist filters)
router.get("/", checkAuth(TUserRole.ADMIN, TUserRole.GUIDE), BookingController.listBookings);

// get own bookings (tourist)
router.get("/my-bookings",checkAuth(TUserRole.TOURIST),BookingController.getUserBookings);

// Get single booking
router.get("/:id", checkAuth(...Object.values(TUserRole)), BookingController.getBooking);

// router.patch("/:bookingId/status", checkAuth(...Object.values(TUserRole)), BookingController.updateBookingStatus);

// Cancel booking
router.patch("/:id/cancel", checkAuth(), BookingController.cancelBooking);

export const BookingRoutes = router;

