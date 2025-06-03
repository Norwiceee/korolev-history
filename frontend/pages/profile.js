import React from "react";
import { Box, Paper, Typography, Avatar, Button, Divider, Stack, CircularProgress } from "@mui/material";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);

    if (!user) {
        // Показываем загрузку, чтобы не мигал редирект
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ background: "linear-gradient(120deg, #21284e 0%, #3949ab 100%)", minHeight: "100vh", py: 10 }}>
            <Paper elevation={6} sx={{ maxWidth: 450, mx: "auto", p: 4, borderRadius: 4 }}>
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
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Здесь появится информация о ваших бронированиях и результатах викторин.
                </Typography>
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
