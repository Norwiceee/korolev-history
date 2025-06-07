// backend/routes/admin-feedback.js
import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "./auth.js";

const router = express.Router();

// Получить все обращения обратной связи (только для админа)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM feedback ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения обращений" });
    }
});

export default router;