import React from "react";
import {
    Box, Paper, Typography, Avatar, Button, Divider, Stack, CircularProgress, List, ListItem, ListItemText
} from "@mui/material";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    // --- Новые состояния для данных ---
    const [quizResults, setQuizResults] = React.useState([]);
    const [bookings, setBookings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // --- Получаем данные по квизам и бронированиям ---
    React.useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        const token = localStorage.getItem("token");
        Promise.all([
            fetch("http://89.104.65.59:4000/api/quizzes/results/my", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json()),
            fetch("http://89.104.65.59:4000/api/profile/bookings", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json())
        ]).then(([quizResults, bookings]) => {
            setQuizResults(quizResults);
            setBookings(bookings);
            setLoading(false);
        });
    }, [user]);

    if (!user || loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ background: "linear-gradient(120deg, #21284e 0%, #3949ab 100%)", minHeight: "100vh", py: 10 }}>
            <Paper elevation={6} sx={{ maxWidth: 500, mx: "auto", p: 4, borderRadius: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
                        <AccountCircleIcon sx={{ fontSize: 56 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
                        <Typography color="text.secondary">{user.email}</Typography>
                        <Typography variant="body2" sx={{ color: "#3949ab" }}>
                            Роль: {user.role === "admin" ? "Администратор" : "Пользователь"}
                        </Typography>
                    </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />

                {/* Квизы */}
                <Typography variant="h6" sx={{ mb: 1 }}>Результаты викторин</Typography>
                {quizResults.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mb: 2 }}>Нет завершённых викторин</Typography>
                ) : (
                    <List dense sx={{ mb: 2 }}>
                        {quizResults.map((qr, i) => (
                            <ListItem key={i}>
                                <ListItemText
                                    primary={qr.title || "Викторина"}
                                    secondary={`Результат: ${qr.score} / ${qr.total_questions ?? "?"} (${new Date(qr.submitted_at).toLocaleString("ru-RU")})`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}


                {/* Бронирования */}
                <Typography variant="h6" sx={{ mb: 1 }}>Ваши бронирования</Typography>
                {bookings.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mb: 2 }}>Нет активных или завершённых бронирований</Typography>
                ) : (
                    <List dense>
                        {bookings.map((b, i) => (
                            <ListItem key={i}>
                                <ListItemText
                                    primary={b.description || "Посещение музея"}
                                    secondary={
                                        <>
                                            <span>Дата: {b.slot_datetime ? new Date(b.slot_datetime).toLocaleString("ru-RU") : ""}</span><br />
                                            <span>Билетов: {b.ticket_count} | Статус: {b.status}</span>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                <Divider sx={{ my: 2 }} />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={logout}
                >
                    Выйти
                </Button>
            </Paper>
        </Box>
    );
}
