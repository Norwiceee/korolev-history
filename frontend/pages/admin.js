import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    CircularProgress,
    Button
} from "@mui/material";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link"; // Импорт обязательно!

// Статистика с иконками
const statsList = [
    { key: "users", label: "Пользователи", icon: "👤" },
    { key: "bookings", label: "Бронирований всего", icon: "📅" },
    { key: "tickets", label: "Продано билетов", icon: "🎫" },
    { key: "slots", label: "Проведено мероприятий", icon: "🕒" },
    { key: "quizResults", label: "Пройдено квизов", icon: "📝" },
    { key: "documents", label: "Загружено документов", icon: "📄" },
    { key: "gallery", label: "Фото в галерее", icon: "🖼️" },
];

// Секции управления
const adminSections = [
    { label: "Викторины", icon: "📝", href: "/admin-quiz" },
    { label: "Галерея", icon: "🖼️", href: "/admin-gallery" },
    { label: "Документы", icon: "📄", href: "/admin-documents" },
    { label: "Билеты", icon: "🎟️", href: "/admin-booking" },
    { label: "Обратная связь", icon: "📬", href: "/admin-feedback" },
];

export default function AdminPanel() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.replace("/");
            return;
        }
        fetch("http://localhost:4000/api/admin/stats", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setStats)
            .finally(() => setLoading(false));
    }, [user]);

    if (!user || user.role !== "admin") return null;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* AdminNavBar не вставлять, он уже подключается в _app.js */}

            <Typography variant="h4" align="center" gutterBottom>
                Админ-панель управления сайтом
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Быстрая статистика по системе
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : stats ? (
                <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                    {statsList.map(({ key, label, icon }) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                            <Paper elevation={5} sx={{ p: 3, textAlign: "center", borderRadius: 4 }}>
                                <Box sx={{ fontSize: 36, mb: 1 }}>{icon}</Box>
                                <Typography variant="h4" color="primary">{stats[key]}</Typography>
                                <Typography variant="subtitle1">{label}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography color="error" align="center">Ошибка загрузки статистики</Typography>
            )}

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                    Разделы управления
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {adminSections.map(section => (
                        <Grid item xs={12} sm={6} md={3} key={section.href}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                                <Box sx={{ mb: 2, fontSize: 32 }}>{section.icon}</Box>
                                <Typography variant="body1" sx={{ mb: 2 }}>{section.label}</Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    component={Link} // вот это важно!
                                    href={section.href}
                                    sx={{ fontWeight: 700, letterSpacing: 1 }}
                                >
                                    Перейти
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}