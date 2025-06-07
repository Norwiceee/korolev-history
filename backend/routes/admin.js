import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "./auth.js";

const router = express.Router();

// Получить быструю статистику для админки
router.get('/stats', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Выполняем все запросы параллельно
        const [
            usersRes,
            bookingsRes,
            ticketsRes,
            slotsRes,
            quizResultsRes,
            documentsRes,
            galleryRes
        ] = await Promise.all([
            db.query("SELECT COUNT(*) as count FROM users"),
            db.query("SELECT COUNT(*) as count FROM bookings"),
            db.query("SELECT COALESCE(SUM(ticket_count),0) as count FROM bookings"),
            db.query("SELECT COUNT(*) as count FROM booking_slots"),
            db.query("SELECT COUNT(*) as count FROM quiz_results"),
            db.query("SELECT COUNT(*) as count FROM documents"),
            db.query("SELECT COUNT(*) as count FROM gallery"),
        ]);

        res.json({
            users: Number(usersRes.rows[0].count),
            bookings: Number(bookingsRes.rows[0].count),
            tickets: Number(ticketsRes.rows[0].count),
            slots: Number(slotsRes.rows[0].count),
            quizResults: Number(quizResultsRes.rows[0].count),
            documents: Number(documentsRes.rows[0].count),
            gallery: Number(galleryRes.rows[0].count),
        });
    } catch (err) {
        console.error("Ошибка получения статистики:", err);
        res.status(500).json({ error: "Ошибка получения статистики" });
    }
});

export default router;