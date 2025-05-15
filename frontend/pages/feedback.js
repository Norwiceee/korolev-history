import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Alert, Box } from "@mui/material";
import { SectionNavigation } from "../components/SectionNavigation";

export default function FeedbackPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:4000/api/feedback", form);
        setSent(true);
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <Container sx={{ py: 5 }}>
            <Typography variant="h4" gutterBottom>Обратная связь</Typography>
            {sent && <Alert severity="success" sx={{ mb: 2 }}>Спасибо за ваше сообщение!</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Имя"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Сообщение"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>Отправить</Button>
            </Box>
            <SectionNavigation
                prev={{ href: "/biography", label: "Биография" }}
                next={{ href: "/gallery", label: "Галерея" }}
            />
        </Container>
    );
}
