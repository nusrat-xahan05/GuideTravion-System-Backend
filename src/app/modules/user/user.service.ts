import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { ITourist, IUser } from "./user.interface";
import { TouristModel, UserModel } from "./user.model";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs"

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


    async registerTourist(payload: Partial<ITourist>) {
        const user = await this.createBaseUser(payload);

        const tourist = await TouristModel.create({
            _id: user._id,
            ...payload
        });

        return tourist
    },
};