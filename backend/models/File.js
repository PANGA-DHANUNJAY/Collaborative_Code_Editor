// models/File.js

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    roomId: {
        type: String, // ✅ Change from ObjectId to String
        required: true
    },
    name: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        // enum: ["javascript", "python", "java", "c", "cpp", "html", "css", "text"] // Add as needed
    },
    content: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// One file name per session constraint
fileSchema.index({ sessionId: 1, name: 1 }, { unique: true });

export default mongoose.model("File", fileSchema);
