import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "my-library",
    });
    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
