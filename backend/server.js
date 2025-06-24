// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./db");

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// connectDB();

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const User = require("./models/User");
// const bcrypt=require("bcrypt")
// const jwt = require("jsonwebtoken");

// // Secret Key for JWT
// const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// connectDB();

// // User Registration Route
// app.post("/register", async (req, res) => {
//   try {
//     console.log("Received Data:", req.body); // Debugging line

//     const { name, email, password} = req.body;

//     if (!name || !email || !password ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         console.log("❌ User already exists:", existingUser);
//         return res.status(400).json({ message: "User already exists" });
//     }

//     // Create a new user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error("❌ Error during registration:", error.message);
//     res.status(500).json({ message: "Server Error", error });
//   }
// });



// // Login Route
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "User not found!" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

//         const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
//         res.json({ message: "Login successful!", token });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import pistonRoutes from "./routes/pistonRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server

app.use(express.json());
app.use(cors());
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/piston", pistonRoutes);
app.use("/api/files", fileRoutes);


const roomUsers = {}; // Keeps track of users per room

io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("join-room", ({ roomId, user }) => {
        console.log("running soket on server");
        socket.join(roomId);
        if (!roomUsers[roomId]) roomUsers[roomId] = [];

        // Prevent duplicates
        const isAlreadyJoined = roomUsers[roomId].some(u => u._id === user._id);
        if (!isAlreadyJoined) {
            roomUsers[roomId].push(user);
        }

        io.to(roomId).emit("room-users", roomUsers[roomId]);
    });

    socket.on("leave-room", ({ roomId, userId }) => {
        socket.leave(roomId);
        if (roomUsers[roomId]) {
            roomUsers[roomId] = roomUsers[roomId].filter(user => user._id !== userId);
            io.to(roomId).emit("room-users", roomUsers[roomId]);
        }
    });

    socket.on("disconnect", () => {
        const rooms = [...socket.rooms].filter(r => r !== socket.id);
        rooms.forEach(roomId => {
            if (roomUsers[roomId]) {
                roomUsers[roomId] = roomUsers[roomId].filter(user => user.socketId !== socket.id);
                io.to(roomId).emit("room-users", roomUsers[roomId]);
            }
        });
    });

    socket.on("code-change", ({ roomId, fileId, code }) => {
        // rooms[roomId] = code; // Store latest code
        socket.to(roomId).emit("update-code", { fileId, code }); // Send updates to others in room
    });

    socket.on("new-file-created", ({ roomId, file }) => {
        // send new file to everyone else
        socket.to(roomId).emit("new-file-created", file);
    });

    // 💬 Handle cursor movement
    socket.on("cursor-move", ({ roomId, fileId, position }) => {
        // Broadcast cursor position to other clients in the same room
        socket.to(roomId).emit("cursor-move", {
            fileId:fileId,
            clientId: socket.id,
            position:position
        });
    });

    socket.on("chat-message", (message) => {
        console.log("Chat message received:", message);
        const roomId  = message.roomId;
        // Send message to all sockets in the room except sender
        socket.to(roomId).emit("chat-message", message);
    });
    // socket.on("cursor-move", ({ userId, roomId, fileId, username, position }) => {
    //     console.log("server - socket listened and emiited");
    //     socket.broadcast.to(roomId).emit("cursor-move", {
    //         userId: userId,
    //         fileId: fileId,
    //         username: username,
    //         position: position,
    //     });
    // });
});


// WebSocket logic for collaborative editing
// const rooms = {}; // Store code per room

// io.on("connection", (socket) => {
//     console.log("🔌 New client connected:", socket.id);

//     socket.on("join-room", ({ roomId, user }) => {
//         console.log("running socket on server");
//         socket.join(roomId);

//         // if (!rooms[roomId]) {
//         //     rooms[roomId] = [];
//         // }

//         // const alreadyJoined = rooms[roomId].some(u => u._id === user._id);
//         // if (!alreadyJoined) {
//         //     rooms[roomId].push(user);
//         // }
//         // console.log(`👥 Updated users in room ${roomId}:`, rooms[roomId]);
//         // // Notify everyone in the room
//         // io.to(roomId).emit("room-users", rooms[roomId]);
//     });

//     socket.on("leave-room", ({ roomId, userId }) => {
//         socket.leave(roomId);
//         if (rooms[roomId]) {
//             rooms[roomId] = rooms[roomId].filter(u => u._id !== userId);
//             io.to(roomId).emit("room-users", rooms[roomId]);
//         }
//     });

//     socket.on("code-change", ({ roomId,fileId, code }) => {
//         // rooms[roomId] = code; // Store latest code
//         socket.to(roomId).emit("update-code",{fileId,code}); // Send updates to others in room
//     });

//     socket.on("new-file-created", ({ roomId, file }) => {
//         // send new file to everyone else
//         socket.to(roomId).emit("new-file-created", file);
//     });

//     socket.on("cursor-move",({userId,roomId,fileId,username,position})=>{
//         console.log("server - socket listened and emiited");
//         socket.broadcast.to(roomId).emit("cursor-move", {
//             userId:userId,
//             fileId:fileId,
//             username:username,
//             position:position,
//           });
//     });
//     socket.on("disconnect", () => {
//         console.log("❌ Client disconnected:", socket.id);
//     });
// });

// Default route
app.get("/", (req, res) => {
    res.send("Code Editor Server Running...");
});

const getLanguageConfig = (language) => {
    switch (language) {
        case "javascript":
            return { extension: "js", command: (filepath) => `node ${filepath}` };
        case "python":
            return { extension: "py", command: (filepath) => `python3 ${filepath}` };
        case "c":
            return {
                extension: "c",
                command: (filepath) => {
                    const exePath = filepath.replace(".c", "");
                    return `gcc ${filepath} -o ${exePath} && ${exePath}`;
                },
            };
        case "java":
            return {
                extension: "java",
                command: (filepath) => {
                    const dir = path.dirname(filepath);
                    const fileName = path.basename(filepath, ".java");
                    return `javac ${filepath} && java -cp ${dir} ${fileName}`;
                },
            };
        default:
            return null;
    }
};

app.post("/api/run", async (req, res) => {
    try {
        const { code, language, share, roomId, fileId } = req.body;

        const langConfig = getLanguageConfig(language);
        if (!langConfig) {
            return res.status(400).json({ output: "Unsupported language." });
        }

        const extension = langConfig.extension;
        const filename = `Temp_${Date.now()}.${extension}`;
        const filepath = path.join(__dirname, "tmp", filename);

        fs.mkdirSync(path.join(__dirname, "tmp"), { recursive: true });
        fs.writeFileSync(filepath, code);

        const command = langConfig.command(filepath);

        exec(command, (error, stdout, stderr) => {
            const output = error ? stderr : stdout;

            // Cleanup files
            fs.unlink(filepath, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });

            // Java and C++ generate extra files to clean
            if (language === "c") {
                fs.unlink(filepath.replace(".c", ""), () => {});
            }
            if (language === "java") {
                const classFile = filepath.replace(".java", ".class");
                fs.unlink(classFile, () => { });
            }

            res.json({ output });

            // if (share && roomId) {
            //     io.to(roomId).emit("output", { fileId, output });
            // }
        });
    } catch (err) {
        console.error("Execution error:", err);
        res.status(500).json({ output: "Server error during code execution." });
    }
});


// Start HTTP & WebSocket Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

