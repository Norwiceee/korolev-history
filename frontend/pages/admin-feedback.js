import React, { useEffect, useState } from "react";
import {
    Container, Typography, Paper, Grid, Box, CircularProgress, Button, Chip
} from "@mui/material";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/router";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString("ru-RU", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

export default function AdminFeedback() {
    const { user } = useAuth();
    const router = useRouter();
    const [feedbacks, setFeedbacks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.replace("/");
            return;
        }
        fetch("http://89.104.65.59:4000/api/admin/feedback", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setFeedbacks)
            .finally(() => setLoading(false));
    }, [user]);

    if (!user || user.role !== "admin") return null;

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Обращения пользователей
            </Typography>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : feedbacks && feedbacks.length ? (
                <Grid container spacing={3}>
                    {feedbacks.map(fb => (
                        <Grid item xs={12} key={fb.id}>
                            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <PersonIcon sx={{ mr: 1 }} color="primary" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 2 }}>{fb.name}</Typography>
                                    <EmailIcon sx={{ mr: 1 }} color="action" />
                                    <Typography variant="subtitle2">{fb.email}</Typography>
                                    <Chip
                                        icon={<AccessTimeIcon />}
                                        label={formatDate(fb.created_at)}
                                        sx={{ ml: "auto" }}
                                    />
                                </Box>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {fb.message}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                    Пока нет обращений.
                </Typography>
            )}
            <Box sx={{ mt: 5, textAlign: "center" }}>
                <Button variant="outlined" onClick={() => router.push("/admin")}>
                    Вернуться в админ-панель
                </Button>
            </Box>
        </Container>
    );
}