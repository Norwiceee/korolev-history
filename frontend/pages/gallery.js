import React, { useState } from "react";
import {
    Box,
    Typography,
    Container,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Dialog,
    DialogContent,
    IconButton,
    Fade,
    Backdrop
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";

const images = [
    {
        src: "/images/korolev1.jpg",
        title: "Сергей Павлович Королёв (портрет)",
        description: "Главный конструктор советской космической программы."
    },
    {
        src: "/images/korolev2.jpg",
        title: "Королёв на работе",
        description: "Королёв в процессе работы с техникой, около 1960-х годов."
    },
    {
        src: "/images/korolev3.jpg",
        title: "Королёв на старте «Восток-6»",
        description: "С.П. Королёв на стартовой позиции во время запуска космического корабля «Восток-6», 1963 г."
    },
    {
        src: "/images/achievement1.jpg",
        title: "Первый выход в открытый космос",
        description: "Алексей Леонов совершает первый в мире выход в открытый космос, 1965 г."
    },
    {
        src: "/images/achievement2.jpg",
        title: "Первая женщина-космонавт",
        description: "Валентина Терешкова — первая женщина-космонавт."
    },
    {
        src: "/images/achievement3.jpg",
        title: "К.Э. Циолковский, С.П. Королёв, Ю.А. Гагарин",
        description: "Основатели и герои советской космонавтики."
    },
    {
        src: "/images/achievement4.jpg",
        title: "Запуск спутника",
        description: "С.П. Королёв на фоне первого спутника Земли."
    }
];

export default function GalleryPage() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleOpen = (img) => {
        setSelected(img);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Галерея достижений и событий
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Фотографии из жизни С.П. Королёва, запусков и истории космонавтики
            </Typography>
            <ImageList
                variant="masonry"
                cols={3}
                gap={20}
                sx={{
                    mx: "auto",
                    maxWidth: 1100,
                }}
            >
                {images.map((img, i) => (
                    <ImageListItem key={i} sx={{ cursor: "pointer", transition: "0.2s", "&:hover img": { transform: "scale(1.05)" } }}>
                        <Box sx={{ overflow: "hidden", borderRadius: 4, boxShadow: 3 }}>
                            <img
                                src={img.src}
                                alt={img.title}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    transition: "transform 0.3s",
                                }}
                                onClick={() => handleOpen(img)}
                            />
                        </Box>
                        <ImageListItemBar
                            title={img.title}
                            subtitle={img.description}
                            actionIcon={
                                <IconButton sx={{ color: "rgba(255,255,255,0.85)" }} onClick={() => handleOpen(img)}>
                                    <ZoomInIcon />
                                </IconButton>
                            }
                            sx={{
                                borderRadius: "0 0 16px 16px",
                                background: "rgba(0,0,0,0.6)"
                            }}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            {/* Modal for viewing the image */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                TransitionComponent={Fade}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backgroundColor: "rgba(0,0,0,0.85)" }
                }}
                PaperProps={{
                    sx: { background: "transparent", boxShadow: "none", p: 0 }
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 24, top: 16, color: "white", zIndex: 2 }}
                >
                    <CloseIcon fontSize="large" />
                </IconButton>
                <DialogContent sx={{ p: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {selected && (
                        <img
                            src={selected.src}
                            alt={selected.title}
                            style={{
                                maxWidth: "90vw",
                                maxHeight: "80vh",
                                borderRadius: 12,
                                boxShadow: "0 6px 40px rgba(0,0,0,0.45)"
                            }}
                        />
                    )}
                </DialogContent>
                {selected && (
                    <Typography variant="h6" align="center" sx={{ color: "white", my: 2 }}>
                        {selected.title}
                    </Typography>
                )}
                {selected && (
                    <Typography variant="body1" align="center" sx={{ color: "white", mb: 3 }}>
                        {selected.description}
                    </Typography>
                )}
            </Dialog>
        </Container>
    );
}
