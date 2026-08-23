import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);
export const connectDB =
  async (): Promise<void> => {
    const mongoURI =
      process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGO_URI is not defined."
      );
    }

    try {
      await mongoose.connect(
        mongoURI
      );

      console.log(
        "MongoDB connected successfully."
      );
    } catch (error) {
      console.error(
        "MongoDB connection failed:",
        error
      );

      throw error;
    }
  };