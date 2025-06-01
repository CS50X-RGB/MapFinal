import User from "../Models/user.js";
import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
    try {
        // Check if the authorization header exists
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please log in.",
            });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token missing.",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded._id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }

        // Find the user in the database
        req.user = await User.findById(decoded._id);
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Proceed to the next middleware
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthenticated. Invalid token.",
            error: err.message,
        });
    }
};

export default isAuth;
