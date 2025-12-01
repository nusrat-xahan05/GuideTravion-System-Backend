import { envVars } from "../config/env"
import { IUser, TUserRole } from "../modules/user/user.interface";
import bcryptjs from "bcryptjs"
import { UserModel } from "../modules/user/user.model";

export const seedSuperAdmin = async() => {
    try{
        const isAdminExist = await UserModel.findOne({email: envVars.SUPER_ADMIN_EMAIL});
        if(isAdminExist){
            console.log("Admin Already Exist");
            return;
        }

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

        const payload: IUser = {
            firstName: envVars.SUPER_ADMIN_NAME,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            country: envVars.SUPER_ADMIN_COUNTRY,
            phone: envVars.SUPER_ADMIN_PHONE,
            role: TUserRole.ADMIN,
            isVerified: true,
        }

        await UserModel.create(payload);
    }catch(err){
        console.log(err);
    }
}