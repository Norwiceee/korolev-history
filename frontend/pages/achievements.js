import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Slide
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SectionNavigation } from "../components/SectionNavigation";

// Список достижений с подробным описанием
const achievements = [
    {
        year: 1957,
        title: "Запуск первого искусственного спутника Земли",
        description: "4 октября 1957 года под руководством С.П. Королёва был успешно выведен на орбиту Спутник-1 — первый искусственный спутник Земли. Это событие ознаменовало начало космической эры и стало важнейшим достижением советской науки.",
        image: "/images/sputnik1.jpg",
        details: "Аппарат весил всего 83,6 кг и передавал радиосигналы, которые принимали радиолюбители всего мира. Успех вывода спутника стал важнейшим шагом в развитии космонавтики."
    },
    {
        year: 1961,
        title: "Первый полёт человека в космос",
        description: "12 апреля 1961 года Юрий Гагарин на корабле «Восток-1», созданном под руководством Королёва, стал первым человеком, совершившим орбитальный полёт вокруг Земли.",
        image: "/images/gagarin.jpg",
        details: "Полёт Гагарина длился 108 минут. Это событие стало историческим прорывом, а СССР — первой страной, отправившей человека в космос."
    },
    {
        year: 1963,
        title: "Первый полёт женщины в космос",
        description: "16 июня 1963 года Валентина Терешкова отправилась в космос на корабле «Восток-6», созданном конструкторским бюро С.П. Королёва, и стала первой женщиной-космонавтом.",
        image: "/images/tereshkova.jpg",
        details: "Терешкова совершила 48 витков вокруг Земли, проведя в космосе почти три дня. Её полёт стал символом женского участия в исследовании космоса."
    },
    {
        year: 1965,
        title: "Первый выход человека в открытый космос",
        description: "18 марта 1965 года космонавт Алексей Леонов совершил первый в истории выход в открытый космос с борта корабля «Восход-2», спроектированного под руководством Королёва.",
        image: "/images/leonov.jpeg",
        details: "Леонов пробыл за бортом корабля 12 минут и 9 секунд. Этот эксперимент доказал возможность работы человека в открытом космосе."
    },
    {
        year: 1966,
        title: "Запуск автоматической станции на Луну",
        description: "31 января 1966 года была осуществлена успешная мягкая посадка автоматической станции «Луна-9» на поверхность Луны. Это был первый аппарат, который передал на Землю панорамные снимки лунного ландшафта.",
        image: "/images/luna9.jpg",
        details: "«Луна-9» совершила первую в истории мягкую посадку на Луну и передала панорамные фотографии поверхности естественного спутника Земли."
    }
];

// Красивое появление модального окна
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AchievementsPage() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleOpen = (ach) => {
        setSelected(ach);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Достижения
            </Typography>
            <Grid container spacing={4}>
                {achievements.map((ach, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 4,
                                boxShadow: 6,
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": { transform: "scale(1.03)", boxShadow: 12 },
                            }}
                            onClick={() => handleOpen(ach)}
                        >
                            {ach.image &&
                                <CardMedia
                                    component="img"
                                    image={ach.image}
                                    alt={ach.title}
                                    sx={{ height: 180, objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                                />
                            }
                            <CardContent>
                                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold" }}>{ach.year}</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>{ach.title}</Typography>
                                <Typography variant="body2">{ach.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Модальное окно */}
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 4, p: 0 }
                }}
            >
                {selected && (
                    <>
                        <DialogTitle sx={{ display: "flex", alignItems: "center", pb: 1 }}>
                            <Box flex={1}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {selected.title}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ color: "primary.main" }}>
                                    {selected.year}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleClose} sx={{ ml: 2 }}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        {selected.image && (
                            <Box sx={{ width: "100%", height: 260, overflow: "hidden" }}>
                                <img
                                    src={selected.image}
                                    alt={selected.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                        )}
                        <DialogContent sx={{ pt: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Кратко
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {selected.description}
                            </Typography>
                            {selected.details && (
                                <>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                        Подробнее
                                    </Typography>
                                    <Typography variant="body2">
                                        {selected.details}
                                    </Typography>
                                </>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
            <SectionNavigation
                prev={{ href: "/gallery", label: "Галерея" }}
                next={{ href: "/documents", label: "Документы" }}
            />
        </Container>
    );
}
