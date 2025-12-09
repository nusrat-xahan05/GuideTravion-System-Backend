import AppError from "../../errorHelpers/AppError";
import { IUser, TUserStatus } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs"
import { createUserTokens } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



export const AuthServices = {
    // GET USER BASIC INFO ------
    async getMe(userId: string) {
        const userInfo = await UserModel.findById(userId).select("-password").lean();

        // if (userInfo?.role === TUserRole.TOURIST) {
        //     const profile = await TouristModel.findOne({ _id: userInfo?._id }).lean();
        //     return {
        //         data: {
        //             ...userInfo, profile
        //         }
        //     };
        // }
        // if (userInfo?.role === TUserRole.GUIDE) {
        //     const profile = await GuideModel.findOne({ _id: userInfo?._id }).lean();
        //     return {
        //         data: {
        //             ...userInfo, profile
        //         }
        //     };
        // }

        return {
            data: userInfo
        }
    },

    // USER LOGIN ------
    async credentialsLogin(payload: Partial<IUser>) {
        const { email, password } = payload;

        const isUserExist = await UserModel.findOne({ email })
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User Email Does Not Exist");
        }

        if (isUserExist.userStatus === TUserStatus.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, `User Is ${isUserExist.userStatus}`);
        }

        const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);
        if (!isPasswordMatched) {
            throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
        }

        const userTokens = createUserTokens(isUserExist);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: pass, ...rest } = isUserExist.toObject();

        return {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest
        }
    },

    // USER PASSWORD CHANGE ------
    async changePassword(oldPassword: string, newPassword: string, decodedToken: JwtPayload) {
        const user = await UserModel.findById(decodedToken.userId);
        if (!user) {
            throw new AppError(httpStatus.BAD_REQUEST, "User Does Not Exist");
        }
        const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user.password as string);

        if (!isOldPasswordMatched) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Incorrect");
        }

        user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
        user.save();
    }
};