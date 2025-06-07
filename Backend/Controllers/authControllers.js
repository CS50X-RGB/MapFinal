import User from "../Models/user.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/features.js";
import sendEmail from "../utils/sendMail.js";
import generateRandomToken from "../utils/generateRandomToken.js";
import redis from "../server.js";
import TransactionModel from "../Models/transcation.js";

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
  if (user.active) {
    const update_user = await User.findByIdAndUpdate(_id, { active: false });
    await redis.zrem('driverLocations', _id);
    await redis.hdel('userData', _id);
    await redis.hdel('profilePic', _id);

  } else {
    return res.status(200)
      .json({
        success: true,
        user: req.user,
      });
  }
};

export const setAuthToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, {
      fcmToken: fcmToken
    });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
      })
    }
    return res.status(200).json({
      message: 'FCM Token Updated successfully',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error"
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
  try {
    const resetIdentifier = req.params.resetIdentifier;
    const { newpass } = req.body;

    const user = await User.findOne({
      resetIdentifier: resetIdentifier
    });
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
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: error
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
  try {
    const user = req.user;
    const { id } = req.body;

    const me = await User.findById(user._id);
    const anotherUser = await User.findById(id);

    if (!me) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
    }

    if (!anotherUser) {
      return res.status(401).json({
        success: false,
        message: "Another user is not authorized",
      });
    }

    const newTransaction = await TransactionModel.create({
      orderedBy: me._id,
      fullfilledBy: anotherUser._id,
      status: "completed",
    });

    if (me.userStars < 5 && anotherUser.userStars) {
      me.userStars = Math.min(5, me.userStars + 0.5);
      anotherUser.userStars = Math.min(5, anotherUser.userStars + 0.5);
    }

    await me.save();
    await anotherUser.save();

    return res.status(200).json({
      success: true,
      message: "Transaction recorded and user stars updated",
      stars: {
        my: me.userStars,
        another: anotherUser.userStars,
      },
      transaction: newTransaction.toObject()
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to update user stats",
    });
  }
};


export const UnSucessTrans = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.body;

    const me = await User.findById(user._id);
    const anotherUser = await User.findById(id);

    if (!me) {
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

    const transaction = await TransactionModel.create({
      orderedBy: me._id,
      fullfilledBy: anotherUser._id,
      status: "cancelled", // consistent lowercase
    });

    // Star adjustment
    anotherUser.userStars = Math.min(5, anotherUser.userStars + 0.5);
    me.userStars = Math.max(0, me.userStars - 0.5);


    if (me.userStars <= 0) {
      me.userStars = 0; // ensure it's not negative
      await me.save();
      await anotherUser.save();
      return res.status(403).json({
        success: false,
        message: "You may be suspended from our platform",
        stars: {
          my: me.userStars,
          anotherUser: anotherUser.userStars,
        },
      });
    }

    await me.save();
    await anotherUser.save();

    return res.status(200).json({
      success: true,
      message: "Transaction recorded and user stars updated",
      stars: {
        my: me.userStars,
        anotherUser: anotherUser.userStars,
      },
      transaction: transaction.toObject()
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Failed to update user stats",
    });
  }
};



export const getTransactions = async (req, res) => {
  try {
    const user_id = req.user._id;

    const successfulTransactions = await TransactionModel.find({
      status: "completed",
      $or: [
        {
          orderedBy: user_id,
        },
        {
          fullfilledBy: user_id
        }
      ]
    }).populate("orderedBy").populate("fullfilledBy");

    const cancelledTransactions = await TransactionModel.find({
      status: "cancelled",
      $or: [
        {
          orderedBy: user_id,
        },
        {
          fullfilledBy: user_id
        }
      ]
    }).populate("orderedBy").populate("fullfilledBy");

    const total_transactions = successfulTransactions.length + cancelledTransactions.length;

    return res.status(200).json({
      success: successfulTransactions,
      cancelled: cancelledTransactions,
      success_len: successfulTransactions.length,
      cancel_len: cancelledTransactions.length,
      total: total_transactions
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
};

export const getTransactionsCancel = async (req, res) => {
  try {
    const user_id = req.user._id;
    const offset = req.params.offset;
    const page = req.params.page;
    const skip = (page - 1) * offset;
    const cancelledTransactions = await TransactionModel.find({
      status: "cancelled",
      $or: [
        {
          orderedBy: user_id,
        },
        {
          fullfilledBy: user_id
        }
      ]
    }).populate("orderedBy")
      .populate("fullfilledBy")
      .skip(skip)
      .limit(offset);
      const total = await TransactionModel.find({
      status: "cancelled",
      $or: [
        {
          orderedBy: user_id,
        },
        {
          fullfilledBy: user_id
        }
      ]
    }).populate("orderedBy")
      .populate("fullfilledBy").countDocuments();
    return res.status(200).json({
      cancelled: cancelledTransactions,
      cancel_len: cancelledTransactions.length,
      total,
      pages : Math.ceil(total/offset)
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
};

export const getTransactionsSuccess = async (req, res) => {
  try {
    const user_id = req.user._id;
    const page = req.params.page;
    const offset = req.params.offset;
    const skip = (page - 1) * offset;
    const successfulTransactions = await TransactionModel.find({
      status: "completed",
      $or: [
        {
          orderedBy: user_id,
        },
        {
          fullfilledBy: user_id
        }
      ]
    }).populate("orderedBy")
      .populate("fullfilledBy")
      .skip(skip)
      .limit(offset);

    const total_transactions = await TransactionModel.find({
      status: "completed",
      $or: [
        {
          orderedBy: user_id,
        },
        {
          fullfilledBy: user_id
        }
      ]
    }).populate("orderedBy")
      .populate("fullfilledBy").countDocuments();

    return res.status(200).json({
      success: successfulTransactions,
      success_len: successfulTransactions.length,
      total: total_transactions,
      pages: Math.ceil(total_transactions / offset)
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
};

export default { getProfile, Login, Register, Logout, getMyProfile, ForgotPassword, ResetPassword, resetDetails, SucessTrans, UnSucessTrans, getTransactions, getTransactionsCancel, getTransactionsSuccess };
