import AppError from "../../errorHelpers/AppError";
import { IUser, TUserStatus } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs"
import { createUserTokens } from "../../utils/userToken";



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

        const userTokens = createUserTokens(isUserExist);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: pass, ...rest } = isUserExist.toObject();

        return {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest
        }
    },
};