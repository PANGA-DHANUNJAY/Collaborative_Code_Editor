import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/run", async (req, res) => {
    const { language, version, files } = req.body;
    console.log("📥 Received from frontend:", { language, version, files });
    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language,
            version,
            files
        });

        res.status(200).json(response.data);
    } catch (err) {
        console.error("🔥 Error calling Piston API:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to execute code." });
    }
    
});

export default router;
