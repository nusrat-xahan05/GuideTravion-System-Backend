/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IBooking, Pagination, TBookingStatus, TCancelledBy } from "./booking.interface";
import { TourModel } from "../tour/tour.model";
import { BookingModel } from "./booking.model";
import { TTourStatus } from "../tour/tour.interface";
import { UserModel } from "../user/user.model";
import { TUserRole, TUserStatus } from "../user/user.interface";
import { TPaymentStatus } from "../payment/payment.interface";
import { BookingQueryHelper } from "../../utils/bookingQueryHelper";
import { PipelineStage } from "mongoose";


export const BookingService = {
    async getActiveBookings(userId: string, userRole: TUserRole, query: Record<string, string>) {
        const helper = new BookingQueryHelper(
            { ...query, status: TBookingStatus.CONFIRMED, active: "true" },
            userId,
            userRole
        );

        const { page, limit, skip } = helper.pagination();

        const pipeline: PipelineStage[] = [
            helper.baseMatch(),
            ...helper.lookups(),
        ];

        const fieldFilters = helper.fieldFilters();
        if (fieldFilters) pipeline.push(fieldFilters);

        const searchStage = helper.search();
        if (searchStage) pipeline.push(searchStage);

        pipeline.push(helper.sort());

        /* ---------- DATA PIPELINE ---------- */
        const dataPipeline = [
            ...pipeline,
            { $skip: skip },
            { $limit: limit },
        ];

        /* ---------- META PIPELINE ---------- */
        const countPipeline = [
            ...pipeline,
            { $count: "total" },
        ];

        const [data, count] = await Promise.all([
            BookingModel.aggregate(dataPipeline),
            BookingModel.aggregate(countPipeline),
        ]);

        const total = count[0]?.total || 0;

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    },


    async getUpcomingBookings(userId: string, userRole: TUserRole, query: Record<string, string>) {
        const helper = new BookingQueryHelper(
            { ...query, status: TBookingStatus.CONFIRMED, upcoming: "true" },
            userId,
            userRole
        );

        const { page, limit, skip } = helper.pagination();

        const pipeline: PipelineStage[] = [
            helper.baseMatch(),
            ...helper.lookups(),
        ];

        const fieldFilters = helper.fieldFilters();
        if (fieldFilters) pipeline.push(fieldFilters);

        const searchStage = helper.search();
        if (searchStage) pipeline.push(searchStage);

        pipeline.push(helper.sort());

        /* ---------- DATA PIPELINE ---------- */
        const dataPipeline = [
            ...pipeline,
            { $skip: skip },
            { $limit: limit },
        ];

        /* ---------- META PIPELINE ---------- */
        const countPipeline = [
            ...pipeline,
            { $count: "total" },
        ];

        const [data, count] = await Promise.all([
            BookingModel.aggregate(dataPipeline),
            BookingModel.aggregate(countPipeline),
        ]);

        const total = count[0]?.total || 0;

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    },


    async getCompletedBookings(userId: string, userRole: TUserRole, query: Record<string, string>) {
        const helper = new BookingQueryHelper(
            { ...query, status: TBookingStatus.COMPLETED },
            userId,
            userRole
        );

        const { page, limit, skip } = helper.pagination();

        const pipeline: PipelineStage[] = [
            helper.baseMatch(),
            ...helper.lookups(),
        ];

        const fieldFilters = helper.fieldFilters();
        if (fieldFilters) pipeline.push(fieldFilters);

        const searchStage = helper.search();
        if (searchStage) pipeline.push(searchStage);

        pipeline.push(helper.sort());

        /* ---------- DATA PIPELINE ---------- */
        const dataPipeline = [
            ...pipeline,
            { $skip: skip },
            { $limit: limit },
        ];

        /* ---------- META PIPELINE ---------- */
        const countPipeline = [
            ...pipeline,
            { $count: "total" },
        ];

        const [data, count] = await Promise.all([
            BookingModel.aggregate(dataPipeline),
            BookingModel.aggregate(countPipeline),
        ]);

        console.log('from service completed booking: ', data);

        const total = count[0]?.total || 0;

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    },


    async getCancelledBookings(userId: string, userRole: TUserRole, query: Record<string, string>) {
        const helper = new BookingQueryHelper(
            { ...query, status: TBookingStatus.CANCELLED },
            userId,
            userRole
        );

        const { page, limit, skip } = helper.pagination();

        const pipeline: PipelineStage[] = [
            helper.baseMatch(),
            ...helper.lookups(),
        ];

        const fieldFilters = helper.fieldFilters();
        if (fieldFilters) pipeline.push(fieldFilters);

        const searchStage = helper.search();
        if (searchStage) pipeline.push(searchStage);

        pipeline.push(helper.sort());

        /* ---------- DATA PIPELINE ---------- */
        const dataPipeline = [
            ...pipeline,
            { $skip: skip },
            { $limit: limit },
        ];

        /* ---------- META PIPELINE ---------- */
        const countPipeline = [
            ...pipeline,
            { $count: "total" },
        ];

        const [data, count] = await Promise.all([
            BookingModel.aggregate(dataPipeline),
            BookingModel.aggregate(countPipeline),
        ]);

        const total = count[0]?.total || 0;

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    },


    // ======================================================
    // GET BOOKINGS FOR LOGGED-IN USER
    // ======================================================
    async getUserBookings(userId: string, userRole: TUserRole) {
        const filter: any = {};

        if (userRole === TUserRole.TOURIST) filter.touristId = userId;
        if (userRole === TUserRole.GUIDE) filter.guideId = userId;

        return BookingModel.find(filter)
            .sort({ createdAt: -1 })
            .populate("tourId");
    },


    async listBookings(filters: any, pagination: Pagination) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const query: any = {};

        if (filters.status) query.status = filters.status;
        if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
        if (filters.guideId) query.guideId = filters.guideId;
        if (filters.touristId) query.touristId = filters.touristId;

        const data = await BookingModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("tourId")
            .populate("guideId", "firstName email")
            .populate("touristId", "firstName email");

        const total = await BookingModel.countDocuments(query);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    },


    // CREATE BOOKING ------ (TOURIST ENDPOINT)
    async createBooking(payload: Partial<IBooking>, touristId: string) {
        console.log('from frontend data payload: ', payload);
        const session = await BookingModel.startSession();

        try {
            session.startTransaction();

            // Validate Tour
            const tour = await TourModel.findById(payload.tourId).session(session);
            if (!tour) {
                throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
            }
            if (tour.status !== TTourStatus.ACTIVE) {
                throw new AppError(httpStatus.BAD_REQUEST, "Tour is not active");
            }

            // Validate Guide
            const guideId = tour.createdBy;
            const guideUser = await UserModel.findById(guideId).session(session);
            if (!guideUser || guideUser.userStatus !== TUserStatus.ACTIVE) {
                throw new AppError(httpStatus.BAD_REQUEST, "Guide is not active");
            }

            // Validate Dates
            if (!payload.startDate || !payload.endDate) {
                throw new AppError(httpStatus.BAD_REQUEST, "Start date and end date are required");
            }
            const start = new Date(payload.startDate);
            const end = new Date(payload.endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
                throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking dates");
            }

            // Strict Guide Availability Check
            const conflictingBooking = await BookingModel.findOne({
                guideId,
                status: {
                    $in: [
                        // TBookingStatus.PENDING, 
                        TBookingStatus.CONFIRMED]
                },
                startDate: { $lte: end },
                endDate: { $gte: start },
            }).session(session);

            if (conflictingBooking) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "Guide is not available for selected dates"
                );
            }

            // Validate Persons
            const persons = Number(payload.persons);
            if (!persons || persons <= 0) {
                throw new AppError(httpStatus.BAD_REQUEST, "Invalid number of persons");
            }
            if (tour.maxGroupSize && persons > tour.maxGroupSize) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    `Maximum ${tour.maxGroupSize} persons allowed`
                );
            }

            // // 6️⃣ Capacity Check
            // const alreadyBooked = conflictingBooking.reduce((sum, b) => sum + (b.persons || 0), 0);
            // if (tour.maxGroupSize && alreadyBooked + persons > tour.maxGroupSize) {
            //     throw new AppError(httpStatus.BAD_REQUEST, "Not enough seats available");
            // }

            // 7️⃣ Calculate Price + Platform Fee
            const pricePerPerson = tour.pricePerPerson;
            const totalAmount = pricePerPerson * persons;

            const PLATFORM_FEE_PERCENT = 0.1; // 10%
            const platformFee = Number((totalAmount * PLATFORM_FEE_PERCENT).toFixed(2));
            const guideEarning = Number((totalAmount - platformFee).toFixed(2));

            // 8️⃣ Create Booking (Soft Lock)
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            const booking = await BookingModel.create(
                [
                    {
                        tourId: tour._id,
                        guideId,
                        touristId,
                        startDate: start,
                        endDate: end,
                        persons,
                        meetingTime: payload.meetingTime,
                        pickupLocation: payload.pickupLocation,
                        dropoffLocation: payload.dropoffLocation,
                        totalAmount,
                        platformFee,
                        guideEarning,
                        paymentStatus: TPaymentStatus.UNPAID,
                        status: TBookingStatus.PENDING,
                        expiresAt,
                        isReviewd: false,
                        notes: payload.notes,
                    }], { session }
            );

            await session.commitTransaction();
            session.endSession();

            return booking[0];
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },


    // ======================================================
    // CANCEL BOOKING
    // ======================================================
    async cancelBooking(
        bookingId: string,
        actorId: string,
        actorRole: TUserRole
    ) {
        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
        }

        if (booking.status !== TBookingStatus.PENDING) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Only pending bookings can be cancelled"
            );
        }

        if (
            actorRole === TUserRole.TOURIST &&
            booking.touristId.toString() !== actorId
        ) {
            throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");
        }

        booking.status = TBookingStatus.CANCELLED;
        booking.cancelledBy =
            actorRole === TUserRole.TOURIST
                ? TCancelledBy.TOURIST
                : actorRole === TUserRole.GUIDE
                    ? TCancelledBy.GUIDE
                    : TCancelledBy.ADMIN;

        await booking.save();
        return booking;
    }
};