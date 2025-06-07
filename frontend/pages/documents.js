import React, { useState, useEffect } from "react";
import {
    Box, Typography, Paper, Grid, Container, Button, InputAdornment,
    TextField, Dialog, DialogTitle, DialogContent, IconButton, Slide, Link
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { SectionNavigation } from "../components/SectionNavigation";

// ---- Утилита для форматирования даты ----
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

// ---- Анимация для диалога ----
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        fetch("http://localhost:4000/api/documents")
            .then(res => res.json())
            .then(setDocuments);
    }, []);

    const filteredDocs = documents.filter(doc =>
        (doc.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (doc.description || "").toLowerCase().includes(search.toLowerCase())
    );

    const handlePreview = (doc) => {
        setSelectedDoc(doc);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDoc(null);
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Документы
            </Typography>

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
                                onClick={() => handlePreview(doc)}
                            >
                                Предпросмотр
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                href={`http://localhost:4000${doc.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ ml: 2, minWidth: 100 }}
                            >
                                Скачать
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Модальное окно предпросмотра PDF */}
            <Dialog
                open={open}
                onClose={handleClose}
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
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2, height: 600 }}>
                    {selectedDoc?.file_url ? (
                        <Box sx={{ width: "100%", height: 560 }}>
                            <iframe
                                src={`http://localhost:4000${selectedDoc?.file_url || ""}`}
                                title={selectedDoc?.title}
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
            <SectionNavigation
                prev={{ href: "/achievements", label: "Достижения" }}
                next={{ href: "/quiz", label: "Викторина" }}
            />
        </Container>
    );
}
