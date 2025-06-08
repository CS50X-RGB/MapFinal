import Redis from 'ioredis';
import { config } from "dotenv";

config({ path: ".env" });

let redis;

if (!redis) {
  redis = new Redis(process.env.REDIS_DB, {
    tls: {},
    //  maxRetriesPerRequest: 3, // Optional but helpful
    reconnectOnError: (err) => {
      console.error("Redis reconnect error:", err);
      return true;
    }
  });

  redis.on('connect', () => {
    console.log("✅ Connected to Redis Cloud..");
  });

  redis.on('error', (err) => {
    console.error("❌ Redis Error:", err);
  });
}

export default redis;
