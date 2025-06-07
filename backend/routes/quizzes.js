import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "./auth.js";

const router = express.Router();

/**
 * КВИЗЫ
 */

// Получить список всех квизов (GET /api/quizzes)
router.get("/", async (req, res) => {
    try {
        const quizzes = await db.query("SELECT id, title, description FROM quizzes ORDER BY id");
        res.json(quizzes.rows);
    } catch (err) {
        console.error("Ошибка получения списка квизов:", err);
        res.status(500).json({ error: "Ошибка получения списка квизов" });
    }
});

// Получить один квиз по id (GET /api/quizzes/:id)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await db.query("SELECT * FROM quizzes WHERE id=$1", [id]);
        if (!quiz.rows.length) return res.status(404).json({ error: "Квиз не найден" });
        res.json(quiz.rows[0]);
    } catch (err) {
        console.error("Ошибка получения квиза:", err);
        res.status(500).json({ error: "Ошибка получения квиза" });
    }
});

// Создать новый квиз (POST /api/quizzes, только админ)
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Название обязательно" });
    try {
        const result = await db.query(
            "INSERT INTO quizzes (title, description) VALUES ($1, $2) RETURNING *",
            [title, description]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Ошибка создания квиза:", err);
        res.status(500).json({ error: "Ошибка создания квиза" });
    }
});

// Удалить квиз (DELETE /api/quizzes/:id, только админ)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    const quizId = req.params.id;
    try {
        await db.query("DELETE FROM quiz_questions WHERE quiz_id = $1", [quizId]);
        await db.query("DELETE FROM quizzes WHERE id = $1", [quizId]);
        res.json({ message: "Квиз и все его вопросы удалены" });
    } catch (err) {
        console.error("Ошибка удаления квиза:", err);
        res.status(500).json({ error: "Ошибка удаления квиза" });
    }
});

/**
 * ВОПРОСЫ КВИЗА
 */

// Получить все вопросы конкретного квиза (GET /api/quizzes/:id/questions)
router.get("/:id/questions", async (req, res) => {
    const quizId = req.params.id;
    try {
        const questions = await db.query(
            "SELECT id, question, options, correct_option, explanation FROM quiz_questions WHERE quiz_id = $1 ORDER BY id",
            [quizId]
        );
        res.json(questions.rows);
    } catch (err) {
        console.error("Ошибка получения вопросов квиза:", err);
        res.status(500).json({ error: "Ошибка получения вопросов" });
    }
});

// Добавить вопрос к квизу (POST /api/quizzes/:id/questions, только админ)
router.post("/:id/questions", requireAuth, requireRole("admin"), async (req, res) => {
    const quizId = req.params.id;
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
    try {
        await db.query(
            "INSERT INTO quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES ($1, $2, $3, $4, $5)",
            [quizId, question, options, correct_option, explanation || ""]
        );
        res.json({ message: "Вопрос добавлен" });
    } catch (err) {
        console.error("Ошибка добавления вопроса:", err);
        res.status(500).json({ error: "Ошибка добавления вопроса" });
    }
});

// Удалить вопрос из квиза (DELETE /api/quizzes/:quizId/questions/:questionId, только админ)
router.delete("/:quizId/questions/:questionId", requireAuth, requireRole("admin"), async (req, res) => {
    const { questionId } = req.params;
    try {
        await db.query("DELETE FROM quiz_questions WHERE id = $1", [questionId]);
        res.json({ message: "Вопрос удалён" });
    } catch (err) {
        console.error("Ошибка удаления вопроса:", err);
        res.status(500).json({ error: "Ошибка удаления вопроса" });
    }
});

// Редактировать вопрос квиза (PATCH /api/quizzes/:quizId/questions/:questionId, только админ)
router.patch("/:quizId/questions/:questionId", requireAuth, requireRole("admin"), async (req, res) => {
    const { questionId } = req.params;
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
    try {
        await db.query(
            "UPDATE quiz_questions SET question=$1, options=$2, correct_option=$3, explanation=$4 WHERE id=$5",
            [question, options, correct_option, explanation || "", questionId]
        );
        res.json({ message: "Вопрос обновлён" });
    } catch (err) {
        console.error("Ошибка обновления вопроса:", err);
        res.status(500).json({ error: "Ошибка обновления вопроса" });
    }
});

/**
 * РЕЗУЛЬТАТЫ
 */

// Сохранить результат квиза (POST /api/quizzes/:id/results)
router.post("/:id/results", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const quizId = req.params.id;
    const { score } = req.body;
    if (typeof score !== "number") {
        return res.status(400).json({ error: "score (число) обязателен" });
    }
    try {
        await db.query(
            "INSERT INTO quiz_results (user_id, quiz_id, score, submitted_at) VALUES ($1, $2, $3, NOW())",
            [userId, quizId, score]
        );
        res.json({ message: "Результат сохранён" });
    } catch (err) {
        console.error("Ошибка сохранения результата:", err);
        res.status(500).json({ error: "Ошибка сохранения результата" });
    }
});

// Получить все результаты пользователя (GET /api/quizzes/results/my)
// backend/routes/quizzes.js
router.get("/results/my", requireAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const results = await db.query(
            `SELECT qr.*, q.title,
                    (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = qr.quiz_id) AS total_questions
             FROM quiz_results qr
                      JOIN quizzes q ON qr.quiz_id = q.id
             WHERE qr.user_id = $1
             ORDER BY qr.submitted_at DESC`,
            [userId]
        );
        res.json(results.rows);
    } catch (err) {
        console.error("Ошибка получения результатов:", err);
        res.status(500).json({ error: "Ошибка получения результатов" });
    }
});



export default router;
