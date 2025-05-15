import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import quizRoutes from "./routes/quiz.js";
import feedbackRoutes from "./routes/feedback.js";
import galleryRoutes from "./routes/gallery.js";
import pagesRoutes from "./routes/pages.js";
import timelineRoutes from "./routes/timeline.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/timeline", timelineRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
