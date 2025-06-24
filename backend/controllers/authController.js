import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res) => {
    // try {
    //     const { name, email, password } = req.body;
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const newUser = await User.create({ name, email, password: hashedPassword });
    //     res.status(201).json({ message: "User registered successfully!" });
    // } catch (error) {
    //     res.status(500).json({ message: "Registration failed", error });
    // }
    try {
        console.log("Received Data:", req.body); // Debugging line
        
        const { name, email, password} = req.body;
        
        if (!name || !email || !password ) {
          return res.status(400).json({ message: "All fields are required" });
        }
        
         // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ User already exists:", existingUser);
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("❌ Error during registration:", error.message);
        res.status(500).json({ message: "Server Error", error });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getUser = async (req, res) => {
    try {
        // Extract user ID from the request object (set by authMiddleware)
        const user = await User.findById(req.user.userId).select("-password"); // Exclude password for security

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user", error });
    }
};