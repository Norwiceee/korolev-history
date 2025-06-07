// backend/routes/profile.js
import express from "express";
import db from "../db.js";
import { requireAuth } from "./auth.js";

const router = express.Router();

router.get("/quiz-results", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const results = await db.query(`
        SELECT qr.score, qr.submitted_at, q.title as quiz_title, COUNT(qq.id) as total_questions
        FROM quiz_results qr
        LEFT JOIN quizzes q ON qr.quiz_id = q.id
        LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
        WHERE qr.user_id = $1
        GROUP BY qr.id, q.title
        ORDER BY qr.submitted_at DESC
    `, [userId]);
    res.json(results.rows);
});

router.get("/bookings", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookings = await db.query(`
        SELECT b.slot_id, b.ticket_count, b.status, b.comment, bs.slot_datetime, bs.description
        FROM bookings b
        LEFT JOIN booking_slots bs ON b.slot_id = bs.id
        WHERE b.user_id = $1
        ORDER BY bs.slot_datetime DESC
    `, [userId]);
    res.json(bookings.rows);
});

export default router;
