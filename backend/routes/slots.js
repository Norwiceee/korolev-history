import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.json([
        { id: 1, time: "2025-06-10 12:00", available: 5 },
        // ...другие слоты
    ]);
});

export default router;
