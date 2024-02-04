import User from "../Models/user.js";
import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
      const { Maps_o_share_token } = req.cookies;
      if (!Maps_o_share_token) {
            return res.status(402).json({
                  sucess: false,
                  message: "Access denied Please Login",
            })
      }
      try {
            const decoded = jwt.verify(Maps_o_share_token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded._id);
            next();
      } catch (err) {
            return res.status(401).json({
                  sucess: false,
                  message: "Unauthenticated.Invalid Token",
            });
      }
};

export default isAuth;