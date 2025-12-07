import { model, Schema, Types } from "mongoose";
import { IGuide, ITourist, IUser, TUserRole, TUserStatus, TVerificationReqStatus } from "./user.interface";

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    bio: { type: String },
    phone: { type: String, required: true },
    address: { type: String },
    country: { type: String, required: true },
    languages: { type: [String], default: [] },

    userStatus: {
        type: String,
        enum: Object.values(TUserStatus),
        default: TUserStatus.ACTIVE,
    },

    isVerified: { type: Boolean, default: false },
    role: {
        type: String,
        enum: Object.values(TUserRole),
        required: true
    },
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
    isVerifiedByAdmin: { type: Boolean, default: false },
    verificationRequest: {type: String, enum: Object.values(TVerificationReqStatus), default:TVerificationReqStatus.NOT_SEND},
    occupation: { type: String, required: true },
    city: { type: String },
    expertise: { type: [String] },
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
