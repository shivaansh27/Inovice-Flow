import mongoose from "mongoose";
import "dotenv/config";

export const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB CONNECTED");
  } catch (error) {
    console.error("DB CONNECTION FAILED:", error.message);
    process.exit(1);
  }
};
