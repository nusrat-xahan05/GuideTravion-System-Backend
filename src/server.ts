import { Server } from "http";

import app from "./app";
import { envVars } from "./app/config/env";
import connectDB from "./app/config/db";
// import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
// import { connectRedis } from "./app/config/redis.config";


let server: Server;
const startServer = async () => {
    try {
        connectDB();

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is Listening To Port ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    // await connectRedis();
    await startServer();
    // await seedSuperAdmin();
})()

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection Detected... Server Shutting Down. ", err);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Detected... Server Shutting Down. ", err);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on("SIGTERM", () => {
    console.log("SIGTERM Signal Received... Server Shutting Down. ");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})