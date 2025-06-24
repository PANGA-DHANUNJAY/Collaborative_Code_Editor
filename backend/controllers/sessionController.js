import Session from "../models/Session.js";
import User from "../models/User.js";
// import { generateRoomId } from "../utils/generateRoomId.js";

export const createSession = async (req, res) => {
    console.log("🔍 Received Data:", req.body); // Debugging: See what is being received

    if (!req.body || !req.body.roomId) {
        console.log("🚨 Missing roomId in request body"); 
        return res.status(400).json({ message: "Room ID is required" }); 
    }

    try {
        const session = await Session.create({ roomId: req.body.roomId });
        res.status(201).json({ message: "Session created!", roomId: req.body.roomId });
    } catch (error) {
        console.error("Error in createSession:", error);
        res.status(500).json({ message: "Failed to create session", error });
    }
};


export const joinSession = async (req, res) => {
    try {
        const { roomId } = req.body;
        const session = await Session.findOne({ roomId });
        if (!session) return res.status(404).json({ message: "Session not found!" });

        // Check if user is already in the session
        if (!session.users.includes(req.user.userId)) {
            // return res.json({ message: "You are already in this session!" });
            session.users.push(req.user.userId);
            await session.save();
            await User.findByIdAndUpdate(req.user.userId, { $push: { sessions: session._id } });
        }
        // Fetch the username (assuming it exists on the user object)
        const user = await User.findById(req.user.userId);
        console.log("User found:", user); // Debugging: Check if user is found
        // const username = user?.name;

        res.json({
            message: "Joined session successfully!",
            session:session,
            user:user,  // Include username in the response
        });
        // res.json({ message: "Joined session successfully!", session });
    } catch (error) {
        res.status(500).json({ message: "Failed to join session", error });
    }
};

export const getUserSessions = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("sessions");
        res.json(user.sessions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch sessions", error });
    }
};
