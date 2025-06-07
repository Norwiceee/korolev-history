import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Paper,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminGalleryUpload() {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    // Получить список фото
    const fetchImages = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/gallery");
            if (!res.ok) throw new Error("Ошибка получения галереи");
            const data = await res.json();
            setImages(data);
        } catch (e) {
            setImages([]);
            setMessage("Ошибка загрузки галереи");
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("description", description);
            const res = await fetch("http://localhost:4000/api/gallery/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });
            const data = await res.json();
            setLoading(false);
            if (res.ok) {
                setMessage("Фото добавлено!");
                setDescription("");
                setFile(null);
                fetchImages();
            } else {
                setMessage(data.error || "Ошибка загрузки");
            }
        } catch (e) {
            setLoading(false);
            setMessage("Ошибка загрузки");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить это фото?")) return;
        try {
            const res = await fetch(`http://localhost:4000/api/gallery/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            // Не пытаемся читать json, если статус не ok и не json
            if (res.ok) {
                setMessage("Фото удалено!");
                fetchImages();
            } else {
                let msg = "Ошибка удаления";
                try {
                    const data = await res.json();
                    msg = data.error || msg;
                } catch {}
                setMessage(msg);
            }
        } catch (e) {
            setMessage("Ошибка соединения с сервером");
        }
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
            {message && (
                <Typography
                    color={message.startsWith("Фото") ? "primary" : "error"}
                    mt={2}
                >
                    {message}
                </Typography>
            )}

            {/* Список фото с кнопкой удаления */}
            <Box mt={4}>
                <Typography variant="h6" mb={2}>Загруженные фото</Typography>
                <ImageList cols={2} gap={20}>
                    {images.map(img => (
                        <ImageListItem key={img.id}>
                            <img
                                src={`http://localhost:4000${img.image_url || img.src}`}
                                alt={img.description}
                                style={{ borderRadius: 8, width: "100%" }}
                            />
                            <ImageListItemBar
                                title={img.description}
                                actionIcon={
                                    <IconButton color="error" onClick={() => handleDelete(img.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                sx={{ borderRadius: "0 0 8px 8px" }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Paper>
    );
}