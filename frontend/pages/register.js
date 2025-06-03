// frontend/pages/register.js

import { useState } from "react";
import { useRouter } from "next/router";
import {
    Container, Box, Typography, TextField, Button, MenuItem, Alert
} from "@mui/material";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await res.json();
            setLoading(false);

            if (!res.ok) throw new Error(data.message || "Ошибка регистрации");

            // Сохраняем токен и переходим на главную
            localStorage.setItem("token", data.token);
            // Можно сохранить и user, если используешь глобальное состояние
            router.push("/");
        } catch (e) {
            setLoading(false);
            setError(e.message);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Регистрация
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    label="Имя"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    select
                    label="Роль"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="client">Клиент</MenuItem>
                    <MenuItem value="admin">Администратор</MenuItem>
                </TextField>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
            </Box>
        </Container>
    );
}
