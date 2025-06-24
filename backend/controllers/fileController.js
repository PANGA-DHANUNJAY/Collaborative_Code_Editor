// File: backend/controllers/fileController.js
import File from "../models/File.js";
import Session from "../models/Session.js";

export const createFile = async (req, res) => {
    try {
        console.log("getting data from frontend", req.body);
        const { roomId, name, language, content } = req.body;

        const newFile = new File({
            roomId,  // ✅ plain string UUID
            name,
            language,
            content
        });

        const savedFile = await newFile.save();
        console.log("saved file", savedFile);

        // Optional: if you're maintaining a codeFiles array in Session
        await Session.findOneAndUpdate(
            { roomId: roomId }, 
            { $push: { codeFiles: savedFile._id } }
        );

        res.status(201).json(savedFile);
    } catch (err) {
        console.error("Error in createFile:", err);
        res.status(500).json({ error: err.message });
    }
};


export const getFiles = async(req,res)=>{
    try {
        console.log(req.params.roomId);
        const files = await File.find({ roomId: req.params.roomId });
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateFile = async(req,res)=>{
    try {
        const updatedFile = await File.findByIdAndUpdate(
            req.params.fileId,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        res.status(200).json(updatedFile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteFile = async (req, res) => {
    try {
        console.log("Deleting file with ID:", req.params.fileId);
        const file = await File.findByIdAndDelete(req.params.fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        // Also remove reference from the session
        await Session.findByIdAndUpdate(file.roomId, {
            $pull: { codeFiles: file._id },
        });

        res.status(200).json(file);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const renameFile = async (req, res) => {
    const { fileId } = req.params;
    const { name,language } = req.body;
    console.log("function renameFile", fileId, name,language);
    if (!name) {
        return res.status(400).json({ error: 'New name is required' });
    }

    try {
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        file.name = name; // Update the name
        file.language=language;
        await file.save(); // Save the changes

        res.status(200).json({ message: 'File renamed successfully', file });
    } catch (error) {
        console.error('Error renaming file:', error);
        res.status(500).json({ error: 'Server error while renaming file' });
    }
};


