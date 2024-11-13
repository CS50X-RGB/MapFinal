import  mongoose  from "mongoose";

const UserType = {
  RegularUser: "RegularUser",
  ResourcePoint: "ResourcePoint",
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fcmToken : {
    type : String,
    required : true
  },
  profilePic: {
    type : String,
    required: true,
  },
  dLNo: {
    type: String,
    required: true,
    unique: true,
  },
  phoneno: {
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select : false,
  },
  userType:{
    type: String,
    enum : Object.values(UserType),
  },
  userStars: {
    type: Number,
    default: 3,
  },
  resetIdentifier: {
    type: String,
  },
  createdAt: {
    type : Date,
    default : Date.now,
  },
});

const User = mongoose.model("User",userSchema);

export default User;

