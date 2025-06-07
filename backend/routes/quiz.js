import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "./auth.js";
const router = express.Router();

// Получить список всех квизов
router.get("/quizzes", async (req, res) => {
    const quizzes = await db.query("SELECT id, title, description FROM quizzes ORDER BY id");
    res.json(quizzes.rows);
});

// Получить вопросы по id квиза
router.get("/quiz/:quizId/questions", async (req, res) => {
    const { quizId } = req.params;
    const questions = await db.query(
        "SELECT id, question, options, correct_option, explanation FROM quiz_questions WHERE quiz_id=$1 ORDER BY id",
        [quizId]
    );
    res.json(questions.rows);
});

// Получить один квиз по id (например, для заголовка/описания)
router.get("/quizzes/:id", async (req, res) => {
    const { id } = req.params;
    const quiz = await db.query("SELECT * FROM quizzes WHERE id=$1", [id]);
    if (!quiz.rows.length) return res.status(404).json({ error: "Квиз не найден" });
    res.json(quiz.rows[0]);
});

// Добавить новый квиз (только админ)
router.post("/quizzes", requireAuth, requireRole("admin"), async (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Не указано название" });
    const result = await db.query(
        "INSERT INTO quizzes (title, description) VALUES ($1, $2) RETURNING id",
        [title, description || ""]
    );
    res.json({ id: result.rows[0].id });
});

// Добавить вопрос в квиз (только админ)
router.post("/quiz/:quizId/questions", requireAuth, requireRole('admin'), async (req, res) => {
    const { quizId } = req.params;
    const { question, options, correct_option, explanation } = req.body;
    if (
        !question ||
        !Array.isArray(options) ||
        options.length < 2 ||
        typeof correct_option !== "number" ||
        correct_option < 0 ||
        correct_option >= options.length
    ) {
        return res.status(400).json({ error: "Проверьте поля: question, options, correct_option" });
    }
    await db.query(
        "INSERT INTO quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES ($1, $2, $3, $4, $5)",
        [quizId, question, options, correct_option, explanation || ""]
    );
    res.json({ message: "Вопрос добавлен" });
});

// Удалить вопрос (только админ)
router.delete("/quiz/:quizId/questions/:id", requireAuth, requireRole("admin"), async (req, res) => {
    const { id } = req.params;
    await db.query("DELETE FROM quiz_questions WHERE id=$1", [id]);
    res.json({ message: "Вопрос удалён" });
});

// Редактировать вопрос (только админ)
router.patch("/quiz/:quizId/questions/:id", requireAuth, requireRole("admin"), async (req, res) => {
    const { id } = req.params;
    const { question, options, correct_option, explanation } = req.body;
    if (
        !question ||
        !Array.isArray(options) ||
        options.length < 2 ||
        typeof correct_option !== "number" ||
        correct_option < 0 ||
        correct_option >= options.length
    ) {
        return res.status(400).json({ error: "Проверьте поля" });
    }
    await db.query(
        "UPDATE quiz_questions SET question=$1, options=$2, correct_option=$3, explanation=$4 WHERE id=$5",
        [question, options, correct_option, explanation || "", id]
    );
    res.json({ message: "Вопрос обновлён" });
});
router.post("/results", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { quiz_id, score } = req.body;
    if (!quiz_id || typeof score !== "number") {
        return res.status(400).json({ error: "quiz_id и score обязательны" });
    }
    await db.query(
        "INSERT INTO quiz_results (user_id, quiz_id, score) VALUES ($1, $2, $3)",
        [userId, quiz_id, score]
    );
    res.json({ message: "Результат сохранён" });
});

export default router;
