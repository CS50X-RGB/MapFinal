import User from "../Models/user.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/features.js";
import sendEmail from "../utils/sendMail.js";
import generateRandomToken from "../utils/generateRandomToken.js";
import redis from "../server.js";

export const Register = async (req, res, next) => {
  try {
    const { name, dLNo, email, phoneno, password, profilePic, userType } = req.body;
    const existingUser = await User.findOne({
      email
    });
    const existingUserPhone = await User.findOne({
      phoneno
    });
    if (existingUserPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone No already registered",
      });
    }
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hash = await bcrypt.hash(password, 10);

    let user = await User.create({
      name,
      email,
      password: hash,
      consumerStats: 0,
      profilePic,
      dLNo,
      userType: userType,
      phoneno: phoneno,
      resetIdentifier: undefined,
    });
    sendToken(user, res, `${user.name} welcome !! to Map-O-Share`, 201);
    sendEmail(email, `Hi, ${user.name} Welcome to Map-O-Share`);
  } catch (err) {
    next(err);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email and password not matching",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Email & password not a match",
      });
    }
    sendToken(user, res, `${user.name} welcome !! to Map-O-Share`, 200);
  } catch (err) {
    next(err);
  }
}

export const Logout = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if(user.active){
      const update_user = await User.findByIdAndUpdate(_id, {active : false});
       await redis.zrem('driverLocations', _id);
      await redis.hdel('userData', _id);
      await redis.hdel('profilePic', _id);
 
  }else{
  return res.status(200) 
    .json({
      success: true,
      user: req.user,
    });
   }
};

export const setAuthToken = async (req,res) => {
  try{
    const { fcmToken } = req.body;
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, {
        fcmToken : fcmToken
     });
     if(!user){
         return res.status(404).json({
           message : "User Not Found"
        })
    }
    return res.status(200).json({
       message : 'FCM Token Updated successfully',
       user 
     });
  }catch(error){
    return res.status(500).json({
       message  : "Server Error"
     })
  }
}

export const getMyProfile = (req, res) => {
  try {
    if (req.user !== null) {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    }
    else {
      return res.status(401).json({
        success: false,
        message: 'Not logged in',
      });
    }
  } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Not logged in ${error}`,
      });
  }
}

export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({
      success: false,
      message: 'Email address is not registered please sign in',
    });
    const resetIdentifier = generateRandomToken();
    user.resetIdentifier = resetIdentifier;
    const re = await user.save();
    console.log(re);
    const resetLink = `https://map-final.vercel.app/resetPassword/${resetIdentifier}`;

    sendEmail(user.email, `Click the following link to reset your password : ${resetLink}`);
    return res.status(200).json({
      success: true,
      message: `Password reset instructions sent to your email.Please check your inbox.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Internal server error. Please try again`,
    });
  }
}

export const ResetPassword = async (req, res) => {
  console.log(req.params.resetIdentifier);
  try {
    const resetIdentifier = req.params.resetIdentifier;
    const { newpass } = req.body;

    const user = await User.findOne({
      resetIdentifier: resetIdentifier
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Inavlid or expired reset link. Please try again",
      });
    }
    user.password = await bcrypt.hash(newpass, 10);
    user.resetIdentifier = undefined;
    await user.save();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    })
  }
};
export const getProfile = async (req,res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    return res.status(200).json({
        success : true,
        user
    });
  } catch (error) {
    return res.status(500).json({
       success : false,
       err : error
   }); 
  }
}
export const resetDetails = async (req, res) => {
  try {
    const { name, email, phone, profilePic, dLNo } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
    }
    if (name && name !== user.name) {
      user.name = name;
    }
    if (email && email !== user.email) {
      user.email = email;
    }
    if (profilePic && profilePic !== user.profilePic) {
      user.profilePic = profilePic;
    }
    if (phone && phone !== user.phone) {
      user.phone = phone;
    }
    if (dLNo && dLNo !== user.dLNo) {
      user.dLNo = dLNo;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User details successfully updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again',
    });
  }
};

export const SucessTrans = async (req, res) => {
  console.log(req.body);
  console.log(req.user.userStars);
  try {
    const user = req.user;
    const { id } = req.body;
    const anotherUser = await User.findOne({
      _id: id,
    })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
    }
    if (!anotherUser) {
      return res.status(401).json({
        success: false,
        message: "Another User is not authorized",
      });
    }
    if (user.userStars === 5) {
      user.userStars = 5;
      anotherUser.userStars = 5;
    } else if (anotherUser.userStars === 5) {
      anotherUser.userStars = 5;
    } else {
      user.userStars = (user.userStars + 0.5);
      anotherUser.userStars = (anotherUser.userStars + 0.5);
      await user.save();
    }
    res.status(200).json({
      success: true,
      message: "User stats updated successfully",
      stars: {
        my: user.userStars,
        another: anotherUser.userStars
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Failed to update user stats",
    });
  }
};

export const UnSucessTrans = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.body;
    console.log(id);
    const anotherUser = await User.findOne({
      _id: id,
    })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
    }
    if (!anotherUser) {
      return res.status(401).json({
        success: false,
        message: "Another User is not authorized",
      });
    }
    anotherUser.userStars = (anotherUser.userStars + 0.75);
    user.userStars = user.userStars - 0.5;
    if (user.userStars === 0) {
      return res.status(403).json({
        message: "U can be sussespended from our platform",
        stars: {
          my: user.userStars,
          anotherUser: anotherUser.user,
        }
      });
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "User stats updated successfully",
      stars: {
        my: user.userStars,
        anotherUser: anotherUser.user
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Failed to update user stats",
    });
  }
};

export default {getProfile, Login, Register, Logout, getMyProfile, ForgotPassword, ResetPassword, resetDetails, SucessTrans, UnSucessTrans };
