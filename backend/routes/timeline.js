import express from "express";
import pool from "../db.js";
const router = express.Router();

// Получить события хронологии
router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM timeline ORDER BY event_date");
    res.json(result.rows);
});

export default router;
