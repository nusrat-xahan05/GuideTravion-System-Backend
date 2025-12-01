import AppError from "../../errorHelpers/AppError";
import { IUser, TUserStatus } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs"



export const AuthServices = {
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

        console.log('fron services: ', isUserExist);
    },
};