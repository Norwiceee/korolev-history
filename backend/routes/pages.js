import express from "express";
import pool from "../db.js";
const router = express.Router();

// Получить одну страницу по slug
router.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
    const result = await pool.query("SELECT * FROM pages WHERE slug = $1", [slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
});

// Получить все страницы определённого типа (например, "achievements", "documents")
router.get("/type/:type", async (req, res) => {
    const type = req.params.type;
    const result = await pool.query("SELECT * FROM pages WHERE type = $1", [type]);
    res.json(result.rows);
});

export default router;
