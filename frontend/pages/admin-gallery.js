import React, { useState } from "react";
import { Box, Button, Typography, TextField, Paper } from "@mui/material";

export default function AdminGalleryUpload() {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("description", description);
        const res = await fetch("http://localhost:4000/api/gallery/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // если токен лежит тут
            },
            body: formData,
        });
        const data = await res.json();
        setLoading(false);
        setMessage(res.ok ? "Фото добавлено!" : (data.error || "Ошибка загрузки"));
        setDescription("");
        setFile(null);
    };

    return (
        <Paper sx={{ p: 4, mt: 5, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" mb={2}>Добавить фото в галерею</Typography>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={e => setFile(e.target.files[0])}
                />
                <TextField
                    label="Описание"
                    value={description}
                    fullWidth
                    onChange={e => setDescription(e.target.value)}
                    sx={{ my: 2 }}
                />
                <Button type="submit" variant="contained" disabled={loading || !file}>
                    {loading ? "Загрузка..." : "Загрузить"}
                </Button>
            </form>
            {message && <Typography color={message.startsWith("Фото") ? "primary" : "error"} mt={2}>{message}</Typography>}
        </Paper>
    );
}
