import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../data/config.js';
import { config } from "dotenv";

// ✅ Load .env first
config({ path: "./.env" });

export const sendToken = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res
    .status(statusCode)
    .cookie("Maps_o_share_token", token, {
      httpOnly: true,
      maxAge: 18 * 1000 * 60 * 60,
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message,
      user,
      token
    });
};
