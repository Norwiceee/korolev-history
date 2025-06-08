import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import feedbackRoutes from "./routes/feedback.js";
import galleryRoutes from "./routes/gallery.js";
import pagesRoutes from "./routes/pages.js";
import timelineRoutes from "./routes/timeline.js";
import authRouter from './routes/auth.js';
import bookingsRouter from "./routes/bookings.js";
import documentsRouter from "./routes/documents.js";
import adminRouter from "./routes/admin.js";
import quizzesRouter from "./routes/quizzes.js";
import profileRouter from "./routes/profile.js";
import adminFeedbackRouter from "./routes/admin-feedback.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));
app.use('/api/auth', authRouter);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/timeline", timelineRoutes);
app.use('/api/bookings', bookingsRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin/feedback", adminFeedbackRouter);
app.use(cors({
    origin: [
        "http://89.104.65.59:3000",
        "http://89.104.65.59:4000",
        "http://89.104.65.59",
        "http://localhost:3000"
    ],
    credentials: true
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
