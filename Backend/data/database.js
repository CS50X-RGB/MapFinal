import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect("mongodb+srv://rohan:rohan@prismamongodb.7oqhqnm.mongodb.net/?retryWrites=true", {
        dbName: "Petro-O-Share",
    }).then((c) => {
        console.log(`DataBase Connected ${c.connection.host}`);
    }).catch((e) => {
        console.log(e);
    });
}

export default connectDB;
