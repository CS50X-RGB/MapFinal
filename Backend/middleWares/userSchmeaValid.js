import { z } from 'zod';

const userSchema = z.object({
        name: z.string().min(1),
        profilePic: z.string().min(1),
        dLNo: z.string().min(14).max(16),
        phoneno: z.string().min(10).max(13),
        email: z.string().email(),
        password: z.string().min(6),
        userType: z.enum(["RegularUser", "ResourcePoint"]),
        userStars: z.number().default(3),
        resetIdentifier: z.string().optional(),
        createdAt: z.date().default(() => new Date()),
});

export const validateUserData = (req, res, next) => {
        const userData = req.body;
        try {
                userSchema.parse(userData);
                next();                
        } catch (error) {
                const err  = [];
                for(let i = 0; i < error.errors.length; i++) {
                        const obj = {
                                path : error.errors[i].path[0],
                                message: error.errors[i].message
                        }
                        err.push(obj);
                }
                console.error(err);
                console.error('Validation error:', error.errors);

                res.status(400).json({
                        success: false,
                        message: 'Invalid user data',
                        errors: err,
                });
        }
};
export default validateUserData;