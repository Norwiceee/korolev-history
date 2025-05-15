import express from "express";
import pool from "../db.js";
const router = express.Router();

// Принять сообщение обратной связи
router.post("/", async (req, res) => {
    const { name, email, message } = req.body;
    await pool.query(
        "INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)",
        [name, email, message]
    );
    res.json({ success: true });
});

export default router;
