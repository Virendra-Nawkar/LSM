import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Import User model


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log("Token from cookies:", token); // Debugging line

        if (!token) {
            return res.status(401).json({
                message: "User not Authenticated",
                success: false
            })
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Decoded JWT:", decode);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            })
        }

        const user = await User.findById(decode.userId).select("-password"); 

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        req.user = user; 
        
        // req.id = decode.userId
        req.user = user;
        next();

    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated;