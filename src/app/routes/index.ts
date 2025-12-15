import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { CheckAvailabilityRoutes } from "../modules/checkAvailability/checkAvailability.routes";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ReviewRoutes } from "../modules/review/review.routes";


export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/tour',
        route: TourRoutes
    },
    {
        path: '/bookings',
        route: BookingRoutes
    },
    {
        path: '/availability',
        route: CheckAvailabilityRoutes
    },
    {
        path: '/payment',
        route: PaymentRoutes
    },
    {
        path: '/reviews',
        route: ReviewRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})