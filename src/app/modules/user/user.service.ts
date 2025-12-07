/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IGuide, ITourist, IUser, TUserRole, TUserStatus, TVerificationReqStatus } from "./user.interface";
import { GuideModel, TouristModel, UserModel } from "./user.model";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs"
import { QueryBuilder } from "../../utils/queryBuilder";
import { guideFields, touristFields, userFields, userSearchableFields, verifyRequiredFieldsForGuide } from "./user.constant";

export const UserServices = {
    async createBaseUser(payload: Partial<IUser>) {
        const { email, password, ...rest } = payload;

        const isUserExist = await UserModel.findOne({ email })
        if (isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email Already Registered");
        }

        const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

        const user = await UserModel.create({
            email,
            password: hashedPassword,
            ...rest
        })

        return user;
    },


    // GET ME USER ------ (USER ENDPOINT)
    async myProfile(userId: string) {
        const userInfo = await UserModel.findById(userId).select("-password").lean();

        if (userInfo?.role === TUserRole.TOURIST) {
            const profile = await TouristModel.findOne({ _id: userInfo?._id }).lean();
            return {
                data: {
                    ...userInfo, profile
                }
            };
        }
        if (userInfo?.role === TUserRole.GUIDE) {
            const profile = await GuideModel.findOne({ _id: userInfo?._id }).lean();
            return {
                data: {
                    ...userInfo, profile
                }
            };
        }

        return {
            data: userInfo
        }
    },

    // GET ALL USERS ------ 
    async getAllUsers(query: Record<string, string>) {
        const queryBuilder = new QueryBuilder(UserModel.find(), query)
        const usersData = queryBuilder
            .filter()
            .search(userSearchableFields)
            .sort()
            .fields()
            .paginate();

        const [data, meta] = await Promise.all([
            usersData.build(),
            queryBuilder.getMeta()
        ])

        return {
            data,
            meta
        }
    },

    // SEND VERIFICATION REQUEST ------ (GUIDE ENDPOINT)
    async sendVerifyReq(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }

        if (user.role !== TUserRole.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "Only Guide accounts can send verification request");
        }

        if (user.userStatus === TUserStatus.BLOCKED) {
            throw new AppError(httpStatus.FORBIDDEN, "Your account is blocked. You cannot request verification.");
        }

        const guide = await GuideModel.findById(userId);
        if (!guide) {
            throw new AppError(httpStatus.NOT_FOUND, "Guide profile not found");
        }

        if (guide.isVerifiedByAdmin === true) {
            throw new AppError(httpStatus.BAD_REQUEST, "You are already a verified guide");
        }

        if (guide.verificationRequest === TVerificationReqStatus.PENDING) {
            throw new AppError(httpStatus.BAD_REQUEST, "Verification request is already pending");
        }

        const missingFields: string[] = [];
        verifyRequiredFieldsForGuide.forEach(field => {
            // first check if field is from UserModel
            if (user[field as keyof typeof user] === undefined || user[field as keyof typeof user] === "" || user[field as keyof typeof user] === null) {
                // If field exists in user schema
                if (field in user) missingFields.push(field);
            }
            // second check if field is from GuideModel
            else if (guide[field as keyof typeof guide] === undefined || guide[field as keyof typeof guide] === "" || guide[field as keyof typeof guide] === null) {
                // If field exists in guide schema
                if (field in guide) missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            throw new AppError(httpStatus.BAD_REQUEST, `Please update your profile. Missing fields: ${missingFields.join(", ")}`);
        }

        // All checks passed → update verificationRequest
        const updatedGuide = await GuideModel.findByIdAndUpdate(
            userId,
            { verificationRequest: TVerificationReqStatus.PENDING },
            { new: true, runValidators: true }
        );

        return {
            data: updatedGuide
        };
    },

    // TOURIST REGISTRATION ------ (TOURIST ENDPOINT)
    async registerTourist(payload: Partial<ITourist>) {
        const user = await this.createBaseUser(payload);

        const tourist = await TouristModel.create({
            _id: user._id,
            ...payload
        });

        return tourist;
    },


    // GUIDE REGISTRATION ------ (GUIDE ENDPOINT)
    async registerGuide(payload: Partial<IGuide>) {
        const user = await this.createBaseUser(payload);

        const guide = await GuideModel.create({
            _id: user._id,
            ...payload
        });

        return guide;
    },

    // UPDATE USER PROFILE BY ID ------ (USER ENDPOINT)
    async updateProfile(userId: string, payload: Partial<IUser | ITourist | IGuide | any>) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new AppError(httpStatus.BAD_REQUEST, "No User Exist With This Id");
        }

        const userPayload: Partial<IUser | any> = {};
        const guidePayload: Partial<IGuide | any> = {};
        const touristPayload: Partial<ITourist | any> = {};

        for (const key in payload) {
            if (userFields.includes(key)) userPayload[key] = payload[key];
            if (guideFields.includes(key)) guidePayload[key] = payload[key];
            if (touristFields.includes(key)) touristPayload[key] = payload[key];
        }

        let updatedUserData = null;
        let updatedExtraData = null;

        if (Object.keys(userPayload).length > 0) {
            updatedUserData = await UserModel.findByIdAndUpdate(
                userId,
                userPayload,
                { new: true, runValidators: true }
            );
        }

        if (user.role === TUserRole.GUIDE && Object.keys(guidePayload).length > 0) {
            updatedExtraData = await GuideModel.findByIdAndUpdate(
                userId,
                guidePayload,
                { new: true, runValidators: true }
            );
        }

        if (user.role === TUserRole.TOURIST && Object.keys(touristPayload).length > 0) {
            updatedExtraData = await TouristModel.findByIdAndUpdate(
                userId,
                touristPayload,
                { new: true, runValidators: true }
            );
        }

        return {
            success: true,
            data: {
                ...(updatedUserData?.toObject?.() ?? {}),
                ...(updatedExtraData?.toObject?.() ?? {})
            }
        };
    },


    // GET SINGLE USER BY ADMIN ------
    async getSingleUser(userId: string) {
        const userInfo = await UserModel.findById(userId).select("-password").lean();
        if (!userInfo) {
            throw new AppError(httpStatus.NOT_FOUND, "No User Exist With This Id");
        }

        if (userInfo.role === TUserRole.TOURIST) {
            const profile = await TouristModel.findOne({ _id: userInfo._id }).lean();
            return {
                data: {
                    ...userInfo, profile
                }
            };
        }
        if (userInfo.role === TUserRole.GUIDE) {
            const profile = await GuideModel.findOne({ _id: userInfo._id }).lean();
            return {
                data: {
                    ...userInfo, profile
                }
            };
        }

        return {
            data: userInfo
        }
    }
};