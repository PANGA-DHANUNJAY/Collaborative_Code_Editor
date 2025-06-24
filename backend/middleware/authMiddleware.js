import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in .env
        req.user = decoded; // Attach user details to the request object
        console.log("🔑 Token verified:", decoded); // Debugging line
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

export default authMiddleware;
