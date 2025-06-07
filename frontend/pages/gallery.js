import React, { useState, useEffect } from "react";
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
    Backdrop,
    Skeleton,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { SectionNavigation } from "../components/SectionNavigation";

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        fetch("http://localhost:4000/api/gallery")
            .then((res) => res.json())
            .then(data => { setImages(data); setLoading(false); })
            .catch(() => { setImages([]); setLoading(false); });
    }, []);

    const handleOpen = (img) => {
        setSelected(img);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, minHeight: "90vh" }}>
            <Box
                sx={{
                    textAlign: "center",
                    mb: 2,
                    position: "relative",
                }}
            >
                <CameraAltIcon sx={{ color: "primary.main", fontSize: 48, mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="primary" gutterBottom>
                    Галерея достижений и событий
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        mb: 3,
                        maxWidth: 650,
                        mx: "auto",
                        fontWeight: 400,
                        fontSize: { xs: "1.05rem", md: "1.15rem" }
                    }}
                >
                    Уникальные фото из жизни С.&nbsp;П.&nbsp;Королёва, запусков и истории космонавтики. Каждый снимок — часть великой эпохи!
                </Typography>
            </Box>
            {loading ? (
                <GridLoadingGallery />
            ) : (
                <ImageList
                    variant="masonry"
                    cols={isMobile ? 1 : 3}
                    gap={24}
                    sx={{
                        mx: "auto",
                        maxWidth: 1200,
                        mb: 2,
                    }}
                >
                    {images.map((img, i) => (
                        <ImageListItem
                            key={i}
                            sx={{
                                cursor: "pointer",
                                transition: "0.2s",
                                borderRadius: 6,
                                "&:hover img": { transform: "scale(1.045)" },
                                boxShadow: "0 4px 36px -6px #3949ab22",
                                overflow: "hidden"
                            }}
                        >
                            <Box sx={{ overflow: "hidden", borderRadius: 6 }}>
                                <img
                                    src={`http://localhost:4000${img.image_url || img.src}`}
                                    alt={img.title || "Фото"}
                                    loading="lazy"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        display: "block",
                                        transition: "transform 0.35s cubic-bezier(.22,.68,.65,1.11)",
                                    }}
                                    onClick={() => handleOpen(img)}
                                />
                            </Box>
                            <ImageListItemBar
                                title={img.title}
                                subtitle={img.description}
                                actionIcon={
                                    <Tooltip title="Увеличить">
                                        <IconButton
                                            sx={{ color: "rgba(255,255,255,0.90)", mr: 1 }}
                                            onClick={() => handleOpen(img)}
                                        >
                                            <ZoomInIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                sx={{
                                    borderRadius: "0 0 16px 16px",
                                    background:
                                        "linear-gradient(0deg, rgba(25,25,50,0.75) 90%, rgba(25,25,50,0.08) 100%)"
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            )}
            {/* Модальное окно увеличения фото */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                TransitionComponent={Fade}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backgroundColor: "rgba(12,15,32,0.98)" }
                }}
                PaperProps={{
                    sx: { background: "transparent", boxShadow: "none", p: 0 }
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 28, top: 24, color: "#fff", zIndex: 2, bgcolor: "#23295188", "&:hover": { bgcolor: "#3949ab" } }}
                >
                    <CloseIcon fontSize="large" />
                </IconButton>
                <DialogContent
                    sx={{
                        p: 0,
                        pt: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "65vh"
                    }}
                >
                    {selected && (
                        <>
                            <img
                                src={`http://localhost:4000${selected.image_url || selected.src}`}
                                alt={selected.title}
                                style={{
                                    maxWidth: "92vw",
                                    maxHeight: "70vh",
                                    borderRadius: 16,
                                    boxShadow: "0 10px 56px 0 #000a",
                                    marginBottom: 16
                                }}
                            />
                            <Typography variant="h6" align="center" sx={{ color: "#fff", mb: 0.5, fontWeight: 700, textShadow: "0 3px 12px #23295190" }}>
                                {selected.title}
                            </Typography>
                            <Typography variant="body1" align="center" sx={{ color: "#eee", mb: 2, fontWeight: 400, textShadow: "0 2px 8px #23295170" }}>
                                {selected.description}
                            </Typography>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <SectionNavigation
                prev={{ href: "/biography", label: "Биография" }}
                next={{ href: "/achievements", label: "Достижения" }}
            />
        </Container>
    );
}

// Красивый скелетон загрузки
function GridLoadingGallery() {
    return (
        <Box sx={{ mt: 5, mb: 6, display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton
                    key={n}
                    variant="rectangular"
                    width={320}
                    height={220 + Math.round(Math.random() * 60)}
                    animation="wave"
                    sx={{ borderRadius: 6, boxShadow: "0 4px 36px -6px #3949ab22" }}
                />
            ))}
        </Box>
    );
}