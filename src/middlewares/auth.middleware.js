import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js"; // Make sure the extension matches your project
import { ApiError } from "../utils/apiError";
import { User } from "../models/user.models.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "Unauthorized: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
});
