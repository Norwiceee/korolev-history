import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { useAuth } from "../components/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const res = await fetch("http://89.104.65.59:4000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            login(data.user, data.token);
            // Перенаправление по роли:
            if (data.user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } else {
            setError(data.message || "Ошибка входа");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>Вход</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Войти</Button>
                </form>
                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Нет аккаунта?{" "}
                        <Link href="/register" style={{ color: "#3949ab", textDecoration: "underline" }}>
                            Зарегистрируйтесь
                        </Link>
                    </Typography>
                    <Typography variant="body2">
                        <Link href="/" style={{ color: "#555", textDecoration: "underline" }}>
                            Вернуться на главную
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
