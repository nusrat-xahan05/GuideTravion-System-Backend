import mongoose from "mongoose";
import { envVars } from "./env";

const connectDB = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected To MongoDB");
    } catch (err) {
        console.log("MongoDB Connection Error", err);
        throw(err);
    }
}

export default connectDB;