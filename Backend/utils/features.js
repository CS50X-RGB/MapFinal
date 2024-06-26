import jwt from 'jsonwebtoken';

export const sendToken = (user, res, message, statusCode = 200) => {
    console.log(user._id);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res
        .status(statusCode)
        .cookie("Maps_o_share_token", token, {
            httpOnly: true,
            maxAge: 18 * 1000 * 60 * 60,
            sameSite  : "none",
            secure: true,
        })
        .json({
            success: true,
            message,
            token
        });
};
