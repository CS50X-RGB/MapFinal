import { config } from "dotenv";

// ✅ Load .env first
config({ path: "./.env" });

export const AWS_NOTIFCATION_SERVER = process.env.AWS_NOTIFCATION_SERVER;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REDIS_DB = process.env.REDIS_DB;