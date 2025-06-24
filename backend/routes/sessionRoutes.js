import express from "express";
import { createSession, joinSession, getUserSessions } from "../controllers/sessionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-session", authMiddleware,createSession);
router.post("/join", authMiddleware, joinSession);
router.get("/user-sessions", authMiddleware, getUserSessions);

export default router;
