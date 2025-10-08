import { env } from "@/env";
import mongoose from "mongoose";
const connectionOptions: mongoose.ConnectOptions = {
  dbName: env.DATABASE_NAME,
};

export async function dbConnect() {
  try {
    const conn = await mongoose.connect(
      String(env.MONGODB_URI),
      connectionOptions,
    );
    return conn;
  } catch (e) {
    throw new Error(e as string);
  }
}
