import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth, requireRole } from "./auth.js";

const router = express.Router();

// Храни PDF в backend/public/uploads
const UPLOADS_DIR = path.resolve("public/uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, `${base}-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// GET: получить список документов
router.get("/", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM documents ORDER BY date DESC");
        rows.forEach(row => {
            row.file_url = row.file_path
                ? `/uploads/${path.basename(row.file_path)}`
                : null;
        });
        res.json(rows);
    } catch (err) {
        console.error("Ошибка получения документов:", err);
        res.status(500).json({ error: "Ошибка получения документов" });
    }
});

// POST: добавить новый документ (только для админа)
router.post("/", requireAuth, requireRole("admin"), upload.single("file"), async (req, res) => {
    try {
        const { title, description, date, source } = req.body;
        if (!title || !req.file) return res.status(400).json({ error: "Файл и заголовок обязательны" });
        const file_path = req.file.path;
        await db.query(
            `INSERT INTO documents (title, description, date, source, file_path)
             VALUES ($1, $2, $3, $4, $5)`,
            [title, description, date || null, source || null, file_path]
        );
        res.json({ message: "Документ добавлен" });
    } catch (err) {
        console.error("Ошибка загрузки документа:", err);
        res.status(500).json({ error: "Ошибка загрузки" });
    }
});

// DELETE: удалить документ (только для админа)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        // Сначала получаем путь к файлу для удаления из ФС
        const { rows } = await db.query("SELECT file_path FROM documents WHERE id = $1", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Документ не найден" });
        const file_path = rows[0].file_path;
        if (file_path && fs.existsSync(file_path)) {
            fs.unlinkSync(file_path); // удаляем файл
        }
        await db.query("DELETE FROM documents WHERE id = $1", [id]);
        res.json({ message: "Документ удалён" });
    } catch (err) {
        console.error("Ошибка удаления документа:", err);
        res.status(500).json({ error: "Ошибка удаления документа" });
    }
});

// PUT: обновить документ (метаданные; только для админа)
router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, source } = req.body;
        await db.query(
            `UPDATE documents SET title=$1, description=$2, date=$3, source=$4 WHERE id=$5`,
            [title, description, date, source, id]
        );
        res.json({ message: "Документ обновлён" });
    } catch (err) {
        console.error("Ошибка обновления документа:", err);
        res.status(500).json({ error: "Ошибка обновления документа" });
    }
});

export default router;