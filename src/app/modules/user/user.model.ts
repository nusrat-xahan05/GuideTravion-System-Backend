import { model, Schema, Types } from "mongoose";
import { IGuide, ITourist, IUser, TUserRole, TUserStatus } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    bio: { type: String },
    phone: { type: String },
    address: { type: String },
    country: { type: String, required: true },
    languages: { type: [String], default: [] },

    role: {
        type: String,
        enum: Object.values(TUserRole),
        required: true,
        default: TUserRole.TOURIST,
    },

    userStatus: {
        type: String,
        enum: Object.values(TUserStatus),
        default: TUserStatus.ACTIVE,
    },

    isVerified: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false,
});

export const UserModel = model<IUser>("User", userSchema);



const touristSchema = new Schema<ITourist>({
    _id: { type: Types.ObjectId, ref: "User", required: true },
    travelInterests: { type: [String], default: [] },
    preferredStyles: { type: [String], default: [] },
    wishlistTours: { type: [Types.ObjectId], ref: "Tour", default: [] },
    bookings: { type: [Types.ObjectId], ref: "Booking", default: [] },
}, {
    timestamps: true,
    versionKey: false,
});

export const TouristModel = model<ITourist>("Tourist", touristSchema);



const guideSchema = new Schema<IGuide>({
    _id: { type: Types.ObjectId, ref: "User", required: true },
    expertise: { type: [String], required: true },
    yearsOfExperience: { type: Number },
    hourlyRate: { type: Number },
    dailyRate: { type: Number },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    // availability: [{ date: String, slots: [String] }]
}, {
    timestamps: true,
    versionKey: false,
});

export const GuideModel = model<IGuide>("Guide", guideSchema);




