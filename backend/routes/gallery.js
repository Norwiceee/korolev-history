import express from "express";
import pool from "../db.js";
const router = express.Router();

// Получить все изображения галереи
router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM gallery ORDER BY id DESC");
    res.json(result.rows);
});

export default router;
