import { useState } from "react";
import { useRouter } from "next/router";
import { Container, Box, Typography, TextField, Button } from "@mui/material";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const res = await fetch("http://localhost:4000/api/auth/login", { // укажи свой порт!
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            // Можно сохранить пользователя в контекст/стейт
            router.push("/");
        } else {
            setError(data.message || "Ошибка входа");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" align="center">Вход</Typography>
                <form onSubmit={handleLogin}>
                    <TextField label="Email" fullWidth margin="normal"
                               value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField label="Пароль" type="password" fullWidth margin="normal"
                               value={password} onChange={e => setPassword(e.target.value)} />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Войти</Button>
                </form>
            </Box>
        </Container>
    );
}
