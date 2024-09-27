const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../schemas/user");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization"); // Use the correct Authorization header
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            if (verified) {
                const user = await User.findOne({ _id: verified._id }); // Does this token belong to a user
                if (user) {
                    req.user = user;
                    next(); // User authenticated successfully
                } else {
                    return res.status(401).json({ message: "Access denied. User not found." });
                }
            } else {
                return res.status(401).json({ message: "Access denied. Invalid token." });
            }
        } else {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
    } catch (err) {
        next(err);
    }
};
module.exports = authMiddleware;
