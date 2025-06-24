import express from "express";
import { createFile, getFiles, updateFile, deleteFile,renameFile } from "../controllers/fileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",  createFile);
router.get("/:roomId",  getFiles);
router.put("/:fileId",  updateFile);
router.put("/rename/:fileId",  renameFile);
router.delete("/:fileId", deleteFile);

export default router;