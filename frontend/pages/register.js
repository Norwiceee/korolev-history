import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
    Container, Box, Typography, TextField, Button, MenuItem, Alert
} from "@mui/material";
import { useAuth } from "../components/AuthContext";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasAdmin, setHasAdmin] = useState(null);
    const router = useRouter();
    const { login } = useAuth();

    // Проверка: есть ли уже админ
    useEffect(() => {
        fetch("http://89.104.65.59:4000/api/auth/has-admin")
            .then(res => res.json())
            .then(data => setHasAdmin(data.hasAdmin))
            .catch(() => setHasAdmin(true)); // Если ошибка — не давать создать админа
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("http://89.104.65.59:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await res.json();
            setLoading(false);

            if (!res.ok) throw new Error(data.message || "Ошибка регистрации");

            login(data.user, data.token);
            // Перенаправление по роли:
            if (data.user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (e) {
            setLoading(false);
            setError(e.message);
        }
    };

    if (hasAdmin === null) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Typography align="center" color="text.secondary">Загрузка...</Typography>
            </Container>
        );
    }

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
                {/* Если нет админа, показываем выбор роли */}
                {!hasAdmin ? (
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
                ) : (
                    // Если админ уже есть, не показываем выбор роли, всегда "клиент"
                    <input type="hidden" value="client" readOnly />
                )}
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
            <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Уже есть аккаунт?{" "}
                    <Link href="/login" style={{ color: "#3949ab", textDecoration: "underline" }}>
                        Войти
                    </Link>
                </Typography>
                <Typography variant="body2">
                    <Link href="/" style={{ color: "#555", textDecoration: "underline" }}>
                        Вернуться на главную
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}