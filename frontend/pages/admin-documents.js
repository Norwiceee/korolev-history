import React, { useState, useEffect } from "react";
import {
    Box, Typography, Paper, Grid, Container, Button, InputAdornment,
    TextField, Dialog, DialogTitle, DialogContent, IconButton, Slide, Link, Alert
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { SectionNavigation } from "../components/SectionNavigation";
import { useAuth } from "../components/AuthContext";

// ---- ФОРМАТ ДАТЫ ----
function formatDateRu(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

// ---- АНИМАЦИЯ ДИАЛОГА ----
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// ---- ФОРМА ДОБАВЛЕНИЯ (ТОЛЬКО ДЛЯ АДМИНА) ----
function AdminDocumentForm({ onUpload }) {
    const { user } = useAuth();
    const [form, setForm] = useState({ title: "", description: "", date: "", source: "" });
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!user || user.role !== "admin") return null;

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleFile = e => setFile(e.target.files[0]);

    const handleSubmit = async e => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!file || !form.title) return setError("Файл и заголовок обязательны");
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        data.append("file", file);

        const res = await fetch("http://localhost:4000/api/documents", {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: data
        });
        const result = await res.json();
        if (res.ok) {
            setSuccess("Документ добавлен!");
            setForm({ title: "", description: "", date: "", source: "" });
            setFile(null);
            onUpload?.();
        } else {
            setError(result.error || "Ошибка загрузки");
        }
    };

    return (
        <Box sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Добавить документ (админ)</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                <TextField
                    label="Название"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Описание"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Дата"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    label="Источник"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    fullWidth
                />
                <Button variant="outlined" component="label" sx={{ minWidth: 150 }}>
                    Загрузить PDF
                    <input type="file" accept="application/pdf" hidden onChange={handleFile} />
                </Button>
                {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
                <Button type="submit" variant="contained" sx={{ minWidth: 150 }}>Добавить</Button>
            </form>
        </Box>
    );
}

// ---- ФОРМА РЕДАКТИРОВАНИЯ (ТОЛЬКО МЕТАДАННЫЕ) ----
function AdminDocumentEditForm({ doc, onClose, onSaved }) {
    const [form, setForm] = useState({
        title: doc.title, description: doc.description || "", date: doc.date || "", source: doc.source || ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError(""); setSuccess("");
        const res = await fetch(`http://localhost:4000/api/documents/${doc.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        if (res.ok) {
            setSuccess("Изменения сохранены!");
            onSaved?.();
            onClose();
        } else {
            setError(data.error || "Ошибка обновления");
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Название"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Описание"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Дата"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Источник"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained">Сохранить</Button>
                <Button onClick={onClose} sx={{ ml: 2 }}>Отмена</Button>
            </form>
        </Box>
    );
}

// ---- ОСНОВНОЙ КОМПОНЕНТ ----
export default function AdminDocumentsPage() {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [reload, setReload] = useState(0);
    const [editDoc, setEditDoc] = useState(null);

    useEffect(() => {
        fetch("http://localhost:4000/api/documents")
            .then(res => res.json())
            .then(setDocuments);
    }, [reload]);

    const filteredDocs = documents.filter(doc =>
        (doc.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (doc.description || "").toLowerCase().includes(search.toLowerCase())
    );

    // --- удалить документ ---
    const handleDelete = async (id) => {
        if (!window.confirm("Удалить документ?")) return;
        const res = await fetch(`http://localhost:4000/api/documents/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) setReload(x => x + 1);
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Документы
            </Typography>
            {/* Форма для загрузки документа только для админа */}
            <AdminDocumentForm onUpload={() => setReload(x => x + 1)} />

            <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                <TextField
                    placeholder="Поиск по названию или описанию..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                    sx={{ width: "100%", maxWidth: 440 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Grid container spacing={4}>
                {filteredDocs.map((doc, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Paper elevation={4} sx={{ borderRadius: 4, p: 2, display: "flex", alignItems: "center" }}>
                            <Box sx={{ mr: 3, color: "primary.main" }}>
                                <DescriptionIcon sx={{ fontSize: 48 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{doc.title}</Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                                    {formatDateRu(doc.date)}
                                </Typography>
                                <Typography variant="body1">{doc.description}</Typography>
                                {doc.source && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <b>Источник:</b> <Link href={doc.source} target="_blank" rel="noopener">{doc.source}</Link>
                                    </Typography>
                                )}
                            </Box>
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{ ml: 2, minWidth: 100 }}
                                onClick={() => { setSelectedDoc(doc); setOpen(true); }}
                            >
                                Предпросмотр
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ ml: 2, minWidth: 100 }}
                            >
                                Скачать
                            </Button>
                            {user?.role === "admin" && (
                                <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
                                    <IconButton color="error" onClick={() => handleDelete(doc.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => setEditDoc(doc)}>
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Модальное окно предпросмотра PDF */}
            <Dialog
                open={open}
                onClose={() => { setOpen(false); setSelectedDoc(null); }}
                maxWidth="md"
                fullWidth
                TransitionComponent={Transition}
                PaperProps={{
                    sx: { borderRadius: 4, minHeight: 500 }
                }}
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                    <Box flex={1}>
                        <Typography variant="h6">{selectedDoc?.title}</Typography>
                    </Box>
                    <IconButton onClick={() => { setOpen(false); setSelectedDoc(null); }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2, height: 600 }}>
                    {selectedDoc?.file_url ? (
                        <Box sx={{ width: "100%", height: 560 }}>
                            <iframe
                                src={selectedDoc.file_url}
                                title={selectedDoc.title}
                                width="100%"
                                height="100%"
                                style={{ border: "none", borderRadius: 8, background: "#333" }}
                                allowFullScreen
                            />
                        </Box>
                    ) : (
                        <Typography>Файл недоступен для предпросмотра.</Typography>
                    )}
                </DialogContent>
            </Dialog>

            {/* Модальное окно редактирования */}
            <Dialog open={!!editDoc} onClose={() => setEditDoc(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать документ</DialogTitle>
                <DialogContent>
                    {editDoc && (
                        <AdminDocumentEditForm
                            doc={editDoc}
                            onClose={() => setEditDoc(null)}
                            onSaved={() => setReload(x => x + 1)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <SectionNavigation
                prev={{ href: "/achievements", label: "Достижения" }}
                next={{ href: "/quiz", label: "Викторина" }}
            />
        </Container>
    );
}