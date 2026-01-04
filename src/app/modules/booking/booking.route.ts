import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";


const router = express.Router();


// GET ACTIVE BOOKING ------ (TOURIST ENDPOINT)
router.get("/active-booked-tours", checkAuth(TUserRole.GUIDE), BookingController.getActiveBookings);

// GET UPCOMING BOOKINGS ------ (GUIDE, TOURIST ENDPOINT)
router.get("/upcoming-booked-tours", checkAuth(TUserRole.GUIDE, TUserRole.TOURIST), BookingController.getUpcomingBookings);

// GET COMPLETED BOOKINGS ------ (TOURIST ENDPOINT)
router.get("/completed-booked-tours", checkAuth(TUserRole.GUIDE), BookingController.getCompletedBookings);

// GET CANCELLED BOOKINGS ------ (TOURIST ENDPOINT)
router.get("/cancelled-booked-tours", checkAuth(TUserRole.GUIDE, TUserRole.TOURIST), BookingController.getCancelledBookings);

// GET ACTIVE BOOKING ------ (TOURIST ENDPOINT)
router.get("/my-bookings", checkAuth(TUserRole.TOURIST), BookingController.getUserBookings);

// List bookings (admin/guide filters)
router.get("/", checkAuth(TUserRole.ADMIN, TUserRole.GUIDE), BookingController.listBookings);

// router.get(
//     "/tourist/past",
//     checkAuth(TUserRole.TOURIST),
//     BookingController.getTouristPastBookings
// );

// CREATE BOOKING ------ (TOURIST ENDPOINT)
router.post("/", checkAuth(...Object.values(TUserRole)), validateRequest(createBookingSchema), BookingController.createBooking);

// router.patch("/:bookingId/status", checkAuth(...Object.values(TUserRole)), BookingController.updateBookingStatus);

// Cancel booking
router.patch("/:id/cancel", checkAuth(), BookingController.cancelBooking);

export const BookingRoutes = router;

