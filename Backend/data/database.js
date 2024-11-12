import mongoose from "mongoose";

const connectDB = (MONGO_URL) => {
    mongoose.connect(MONGO_URL, {
        dbName: "Petro-O-Share",
    }).then((c) => {
        console.log(`DataBase Connected ${c.connection.host}`);
    }).catch((e) => {
        console.log(e);
    });
}

export default connectDB;
