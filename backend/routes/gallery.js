import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../db.js";
import { requireAuth, requireRole } from "./auth.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/gallery");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_"));
    },
});
const upload = multer({ storage });

// Получить все фото
router.get("/", async (req, res) => {
    try {
        const images = await db.query("SELECT * FROM gallery ORDER BY uploaded_at DESC");
        res.json(images.rows);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения галереи" });
    }
});

// Загрузить фото
router.post(
    "/upload",
    requireAuth,
    requireRole("admin"),
    upload.single("image"),
    async (req, res) => {
        const { description } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({ error: "Нет файла" });
        try {
            const imageUrl = `/uploads/gallery/${file.filename}`;
            await db.query(
                "INSERT INTO gallery (image_url, description) VALUES ($1, $2)",
                [imageUrl, description || ""]
            );
            res.json({ message: "Фото добавлено", imageUrl });
        } catch (err) {
            res.status(500).json({ error: "Ошибка загрузки" });
        }
    }
);

// Удалить фото по id
router.delete(
    "/:id",
    requireAuth,
    requireRole("admin"),
    async (req, res) => {
        const { id } = req.params;
        try {
            // Найти фото
            const { rows } = await db.query("SELECT image_url FROM gallery WHERE id = $1", [id]);
            if (!rows.length) return res.status(404).json({ error: "Фото не найдено" });
            const filePath = path.resolve("public", rows[0].image_url.replace(/^\//, "")); // удаляем ведущий слэш

            // Удалить из базы
            await db.query("DELETE FROM gallery WHERE id = $1", [id]);

            // Удалить файл с диска (игнорировать ошибку если файла уже нет)
            fs.unlink(filePath, () => {});
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: "Ошибка удаления фото" });
        }
    }
);

export default router;