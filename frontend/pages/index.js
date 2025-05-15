import React from "react";
import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimelineIcon from "@mui/icons-material/Timeline";
import CollectionsIcon from "@mui/icons-material/Collections";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import QuizIcon from "@mui/icons-material/Quiz";
import Link from "next/link";
import {SectionNavigation} from "../components/SectionNavigation";

export default function Home() {
    return (
        <Box
            sx={{
                background: "linear-gradient(120deg, #21284e 0%, #3949ab 100%)",
                minHeight: "100vh",
                py: 10,
                display: "flex",
                alignItems: "center"
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={8}
                    sx={{
                        px: { xs: 2, sm: 6 },
                        py: { xs: 4, sm: 8 },
                        borderRadius: 5,
                        background: "rgba(255,255,255,0.96)"
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: "center",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            color: "primary.main",
                            mb: 2,
                            textShadow: "0 4px 32px #28359366"
                        }}
                    >
                        Королёв и Космос
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: "#555", mb: 4 }}
                    >
                        Исторический портал, посвящённый жизни и достижениям Сергея Павловича Королёва — главного конструктора советской космической программы.
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{ color: "#21284e", mb: 4 }}
                    >
                        Изучайте хронологию великих открытий, знакомьтесь с уникальными документами и архивными материалами, вдохновляйтесь фотографиями, проходите увлекательные викторины — и погружайтесь в историю, которая изменила мир!
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/timeline" passHref legacyBehavior>
                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={<TimelineIcon />}
                                    variant="outlined"
                                    sx={{
                                        py: 2,
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        borderRadius: 4
                                    }}
                                >
                                    Хронология
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/biography" passHref legacyBehavior>
                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={<StarIcon />}
                                    variant="outlined"
                                    sx={{
                                        py: 2,
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        borderRadius: 4
                                    }}
                                >
                                    Биография
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/gallery" passHref legacyBehavior>
                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={<CollectionsIcon />}
                                    variant="outlined"
                                    sx={{
                                        py: 2,
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        borderRadius: 4
                                    }}
                                >
                                    Галерея
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/achievements" passHref legacyBehavior>
                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={<EmojiEventsIcon />}
                                    variant="outlined"
                                    sx={{
                                        py: 2,
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        borderRadius: 4
                                    }}
                                >
                                    Достижения
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/documents" passHref legacyBehavior>
                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={<DocumentScannerIcon />}
                                    variant="outlined"
                                    sx={{
                                        py: 2,
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        borderRadius: 4
                                    }}
                                >
                                    Документы
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/quiz" passHref legacyBehavior>
                                <Button
                                    fullWidth
                                    size="large"
                                    startIcon={<QuizIcon />}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        py: 2,
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        borderRadius: 4
                                    }}
                                >
                                    Викторина
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Typography align="center" sx={{ color: "#aaa", fontSize: "0.95rem" }}>
                        © {new Date().getFullYear()} Проект «Королёв и Космос» | Cделано с любовью к истории и науке 🚀
                    </Typography>
                </Paper>
            </Container>
        </Box>

    );
}
