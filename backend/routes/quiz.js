import express from "express";
import pool from "../db.js";
const router = express.Router();

// Получить все вопросы викторины
router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM quiz_questions");
    res.json(result.rows);
});

// Сохранить результат викторины
router.post("/result", async (req, res) => {
    const { username, score } = req.body;
    await pool.query(
        "INSERT INTO quiz_results (username, score) VALUES ($1, $2)",
        [username, score]
    );
    res.json({ success: true });
});

export default router;
