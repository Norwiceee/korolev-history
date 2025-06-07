import React from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Stack,
    Avatar,
    Fade,
    Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimelineIcon from "@mui/icons-material/Timeline";
import CollectionsIcon from "@mui/icons-material/Collections";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import QuizIcon from "@mui/icons-material/Quiz";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useAuth } from "../components/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
    const { user, logout } = useAuth();
    const router = useRouter();

    // Список разделов (все, что есть на сайте)
    const sections = [
        {
            href: "/timeline",
            label: "Хронология",
            icon: <TimelineIcon sx={{ fontSize: 36 }} color="primary" />,
            color: "primary",
            variant: "outlined",
        },
        {
            href: "/biography",
            label: "Биография",
            icon: <StarIcon sx={{ fontSize: 36 }} color="primary" />,
            color: "primary",
            variant: "outlined",
        },
        {
            href: "/gallery",
            label: "Галерея",
            icon: <CollectionsIcon sx={{ fontSize: 36 }} color="primary" />,
            color: "primary",
            variant: "outlined",
        },
        {
            href: "/achievements",
            label: "Достижения",
            icon: <EmojiEventsIcon sx={{ fontSize: 36 }} color="primary" />,
            color: "secondary",
            variant: "outlined",
        },
        {
            href: "/documents",
            label: "Документы",
            icon: <DocumentScannerIcon sx={{ fontSize: 36 }} color="primary" />,
            color: "primary",
            variant: "outlined",
        },
        {
            href: "/quiz",
            label: "Викторина",
            icon: <QuizIcon sx={{ fontSize: 36 }} color="secondary" />,
            color: "secondary",
            variant: "contained",
        },
        {
            href: "/bookings",
            label: "Билеты",
            icon: <ConfirmationNumberIcon sx={{ fontSize: 36 }} color="secondary" />,
            color: "secondary",
            variant: "contained",
        },
        {
            href: "/feedback",
            label: "Обратная связь",
            icon: <FeedbackIcon sx={{ fontSize: 36 }} color="primary" />,
            color: "inherit",
            variant: "text",
        },
    ];

    return (
        <Box
            sx={{
                background: "linear-gradient(120deg, #232951 0%, #5a61c7 100%)",
                minHeight: "100vh",
                py: { xs: 6, md: 10 },
                display: "flex",
                alignItems: "center",
            }}
        >
            <Container maxWidth="md">
                <Fade in timeout={800}>
                    <Paper
                        elevation={8}
                        sx={{
                            px: { xs: 2, sm: 6 },
                            py: { xs: 4, sm: 7 },
                            borderRadius: 6,
                            background: "rgba(255,255,255,0.98)",
                            position: "relative",
                            boxShadow: "0 6px 36px 0 #23295130",
                        }}
                    >
                        {/* Акцентная зона - название + слоган */}
                        <Typography
                            variant="h2"
                            sx={{
                                textAlign: "center",
                                fontWeight: 900,
                                letterSpacing: "2px",
                                color: "primary.main",
                                mb: 1,
                                textShadow: "0 4px 24px #28359366",
                                lineHeight: 1.15,
                            }}
                        >
                            Королёв и Космос
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: "#4a4989",
                                mb: 2,
                                fontWeight: 500,
                                textShadow: "0 2px 8px #28359310",
                            }}
                        >
                            Исторический портал о жизни и открытиях Сергея Павловича Королёва —
                            главного конструктора советской космической программы.
                        </Typography>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                color: "#21284e",
                                mb: 4,
                                fontSize: "1.14rem",
                                fontWeight: 400,
                            }}
                        >
                            Погрузитесь в историю космонавтики: хронология событий, биография,
                            архивные документы, фотографии и достижения. Пройдите викторины,
                            бронируйте билеты, изучайте наследие великого конструктора!
                        </Typography>

                        {/* Секции сайта */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {sections.map((sec) => (
                                <Grid item xs={12} sm={6} md={4} key={sec.href}>
                                    <Link href={sec.href} passHref legacyBehavior>
                                        <Button
                                            fullWidth
                                            size="large"
                                            variant={sec.variant}
                                            color={sec.color}
                                            startIcon={sec.icon}
                                            sx={{
                                                py: 2.2,
                                                fontWeight: 700,
                                                fontSize: "1.12rem",
                                                borderRadius: 4,
                                                boxShadow:
                                                    sec.variant === "contained"
                                                        ? "0 4px 16px #28359326"
                                                        : "none",
                                                mb: { xs: 0, md: 0 },
                                                textTransform: "none",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            {sec.label}
                                        </Button>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Блок пользователя */}
                        {user ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: "secondary.main",
                                        width: 70,
                                        height: 70,
                                        fontSize: 36,
                                        mb: 1,
                                        boxShadow: "0 2px 12px #5a61c766",
                                    }}
                                >
                                    {user.name?.charAt(0).toUpperCase() || "П"}
                                </Avatar>
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 0.5, fontWeight: 700, letterSpacing: 1 }}
                                >
                                    {user.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#757575",
                                        mb: 1,
                                        fontWeight: 400,
                                    }}
                                >
                                    Роль: <b>{user.role === "admin" ? "Администратор" : "Пользователь"}</b>
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="medium"
                                        onClick={() => router.push("/profile")}
                                        sx={{ borderRadius: 4, fontWeight: 700, px: 3 }}
                                    >
                                        Профиль
                                    </Button>
                                    <Button
                                        variant="text"
                                        color="secondary"
                                        size="medium"
                                        onClick={() => { logout(); router.push("/"); }}
                                        sx={{ borderRadius: 4, fontWeight: 700, px: 3 }}
                                    >
                                        Выйти
                                    </Button>
                                </Stack>
                                {user.role === "admin" && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="medium"
                                        sx={{ mt: 2, borderRadius: 4, px: 4, fontWeight: 800 }}
                                        onClick={() => router.push("/admin")}
                                    >
                                        Админ-панель
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            // Гости: показать вход и регистрацию
                            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 2 }}>
                                <Link href="/login" passHref legacyBehavior>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<LoginIcon />}
                                        sx={{
                                            borderRadius: 4,
                                            fontWeight: 700,
                                            px: 4,
                                        }}
                                    >
                                        Войти
                                    </Button>
                                </Link>
                                <Link href="/register" passHref legacyBehavior>
                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<PersonAddIcon />}
                                        sx={{
                                            borderRadius: 4,
                                            fontWeight: 700,
                                            px: 4,
                                        }}
                                    >
                                        Регистрация
                                    </Button>
                                </Link>
                            </Stack>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography align="center" sx={{ color: "#aaa", fontSize: "0.97rem" }}>
                            © {new Date().getFullYear()} Проект «Королёв и Космос» | Сделано с любовью к истории и науке 🚀
                        </Typography>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
}