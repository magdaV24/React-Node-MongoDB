
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
export const mongooseConfig = async () => {
    const URI: string = process.env.URI || ""
  try {
    await mongoose.connect(URI);
    console.log("Successfully connected to the database!");
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    process.exit(1);
  }
};
