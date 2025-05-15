import React from "react";
import { Box, Typography, Avatar, Grid, Paper, Button } from "@mui/material";
import { SectionNavigation } from "../components/SectionNavigation";

// Пример фактов
const facts = [
    "Родился 12 января 1907 года в Житомире.",
    "Главный конструктор советской космической программы.",
    "Запустил первый искусственный спутник Земли (1957).",
    "Руководил полётом первого человека в космос (Юрий Гагарин, 1961).",
    "Реабилитирован после сталинских репрессий в 1957 году.",
    "Похоронен в Кремлёвской стене на Красной площади."
];

const highlights = [
    {
        date: "1907",
        event: "Рождение и детство в Житомире и Одессе."
    },
    {
        date: "1930",
        event: "Окончил МВТУ им. Баумана."
    },
    {
        date: "1945-1946",
        event: "Начало работы над баллистическими ракетами."
    },
    {
        date: "1957",
        event: "Запуск первого спутника Земли."
    },
    {
        date: "1961",
        event: "Полёт Гагарина в космос."
    }
];

// Мини-галерея
const gallery = [
    { src: "/images/korolev2.jpg", alt: "Молодой Королёв" },
    { src: "/images/korolev3.jpg", alt: "С коллективом" },
    { src: "/images/korolev1.jpg", alt: "С Гагариным" }
];

export default function BiographyPage() {
    return (
        <Box sx={{ py: 5, bgcolor: "#f8fafc", minHeight: "100vh" }}>
            <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
                    <Avatar
                        src="/images/korolev1.jpg"
                        alt="Сергей Королёв"
                        sx={{ width: 120, height: 120, boxShadow: 3 }}
                    />
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900 }}>
                            Сергей Павлович Королёв
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, color: "text.secondary" }}>
                            Основоположник практической космонавтики
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
                            “Путь к звёздам открыт!” — С. П. Королёв
                        </Typography>
                    </Box>
                </Box>

                <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Краткая биография
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Сергей Павлович Королёв — советский учёный, инженер и главный конструктор, сыгравший ключевую роль в освоении космоса. Он стоял у истоков создания ракетно-космической отрасли, запустил первый искусственный спутник Земли и осуществил первый полёт человека в космос. Благодаря его гениальным идеям и твердому характеру человечество совершило прорыв в космос.
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 1 }}>
                        {facts.map((fact, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Typography variant="body2">• {fact}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
                    Вехи жизни
                </Typography>
                <Grid container spacing={2}>
                    {highlights.map((item, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{item.date}</Typography>
                                <Typography variant="body2">{item.event}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
                    Интересные факты
                </Typography>
                <ul>
                    <li>Его имя было засекречено вплоть до 1966 года.</li>
                    <li>Королёв неоднократно сидел в лагерях и чудом выжил.</li>
                    <li>Имел удивительное чутьё на таланты, собрал уникальную команду.</li>
                    <li>Любил стихи и часто цитировал Есенина.</li>
                </ul>

                <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
                    Фото
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                    {gallery.map((img, i) => (
                        <Avatar
                            key={i}
                            src={img.src}
                            alt={img.alt}
                            variant="rounded"
                            sx={{ width: 120, height: 90, boxShadow: 1, borderRadius: 2, cursor: "pointer", transition: "transform 0.2s", "&:hover": { transform: "scale(1.07)" } }}
                        />
                    ))}
                </Box>

                <SectionNavigation
                    prev={{ href: "/timeline", label: "Хронология" }}
                    next={{ href: "/gallery", label: "Галерея" }}
                />
            </Box>
        </Box>
    );
}
