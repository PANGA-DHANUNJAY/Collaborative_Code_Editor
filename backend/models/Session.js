import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    roomId: { type: String, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    codeFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Session", sessionSchema);
