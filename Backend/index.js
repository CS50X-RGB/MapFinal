import express from "express";
import { config } from "dotenv";

// ✅ Load .env first
config({ path: "./.env" });

import connectDB from "./data/database.js";
import cookieParser from "cookie-parser";
import UserRouter from "./Router/auth.js";
import morgan from "morgan";
import LocationRouter from "./Router/location.js";
import NotificationRouter from "./Router/notify.js";
import DataRouter from "./Router/dataPriceFetcher.js";
import cors from 'cors';
import bodyParser from "body-parser";
import redis from "./utils/redis.js";
const app = express();


app.use(
  cors({
    origin: ['https://map-final.vercel.app', 'http://localhost:3000'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json({ extended: true, parameterLimit: 100, limit: "40mb" }));
 
app.use(express.json({ limit: '50mb' }));
app.use(morgan());
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/location", LocationRouter);
app.use("/api/v1/notify", NotificationRouter);
app.use("/api/v1/data", DataRouter);



/*
const redis = new Redis(process.env.REDIS_DB);



redis.on('connect', () => {
  console.log("Connected to Redis Cloud..");
});


redis.on('error', (err) => {
  console.error("Error connecting to Redis:", err);
});


*/
app.listen(3005, () => {
  console.log("Listening to 3005");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something not working");
})

connectDB(process.env.DATABASE_URL);

export default redis;
