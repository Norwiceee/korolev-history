// backend/routes/admin-gallery.js
import express from "express";
import multer from "multer";
import path from "path";
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

router.get("/", async (req, res) => {
    try {
        const images = await db.query("SELECT * FROM gallery ORDER BY uploaded_at DESC");
        res.json(images.rows);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения галереи" });
    }
});

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

export default router;
