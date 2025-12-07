import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IGuide, ITourist, IUser, TUserRole } from "./user.interface";
import { GuideModel, TouristModel, UserModel } from "./user.model";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs"
import { QueryBuilder } from "../../utils/queryBuilder";
import { userSearchableFields } from "./user.constant";

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

    // UPDATE USER PROFILE BY ID ------ (USER ENDPOINT)
    async updateProfile(userId: string, payload: Partial<IUser | IGuide | ITourist>) {
        const isUserExist = await UserModel.findById(userId);
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "No User Exist With This Id");
        }

        let updatedData = null;
        if(isUserExist.role === TUserRole.ADMIN){
            updatedData = await UserModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
        }
        if(isUserExist.role === TUserRole.GUIDE){
            updatedData = await GuideModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
        }
        if(isUserExist.role === TUserRole.TOURIST){
            updatedData = await TouristModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
        }

        return {
            data: updatedData
        }
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