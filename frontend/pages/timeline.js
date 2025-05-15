import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Typography, Box, Container } from "@mui/material";
import Starfield from "../components/Starfield";
import { SectionNavigation } from "../components/SectionNavigation";

// Стили для белого цвета даты
const whiteDateStyle = {
    color: '#fff',
    fontWeight: 500,
    fontSize: 18,
    textShadow: "0 1px 8px #23283c"
};

const events = [
    {
        date: "12 января 1907",
        title: "Рождение",
        description: "Сергей Павлович Королёв родился в Житомире, в семье учителя.",
    },
    {
        date: "1 сентября 1924",
        title: "Поступление в институт",
        description: "Поступил в Киевский политехнический институт.",
    },
    {
        date: "1 июня 1930",
        title: "Окончание МВТУ",
        description: "Окончил Московское высшее техническое училище (МВТУ) имени Баумана по специальности 'самолётостроение'.",
    },
    {
        date: "1 сентября 1931",
        title: "Работа в ГИРД",
        description: "Начал работу в Группе изучения реактивного движения (ГИРД), где разрабатывал первые советские ракеты.",
    },
    {
        date: "27 июня 1940",
        title: "Арест и заключение",
        description: "Был арестован по ложному обвинению и отправлен в заключение.",
    },
    {
        date: "1 июля 1944",
        title: "Освобождение",
        description: "Был освобождён и возвращён к работе над оборонными проектами.",
    },
    {
        date: "4 октября 1957",
        title: "Запуск Спутника-1",
        description: "Под руководством Королёва осуществлён запуск первого искусственного спутника Земли.",
    },
    {
        date: "12 апреля 1961",
        title: "Полет Гагарина",
        description: "Юрий Гагарин совершил первый в мире орбитальный полёт человека в космос на корабле 'Восток'.",
    },
    {
        date: "16 июня 1963",
        title: "Первая женщина-космонавт",
        description: "Валентина Терешкова стала первой женщиной-космонавтом.",
    },
    {
        date: "18 марта 1965",
        title: "Первый выход в открытый космос",
        description: "Алексей Леонов впервые в мире вышел в открытый космос.",
    },
    {
        date: "14 января 1966",
        title: "Смерть",
        description: "Сергей Павлович Королёв скончался в Москве. Похоронен у Кремлёвской стены.",
    }
];

export default function TimelinePage() {
    return (
        <Container maxWidth="lg" sx={{ py: 5, position: "relative" }}>
            <Box sx={{
                position: "relative",
                minHeight: 900,
                borderRadius: 6,
                overflow: "hidden",
                boxShadow: 3,
                background: "radial-gradient(ellipse at 60% 40%, #1c2240 0%, #050611 100%)"
            }}>
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 0,
                        pointerEvents: "none"
                    }}
                >
                    <Starfield width={1200} height={900} starCount={90} />
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        px: { xs: 1, sm: 4 },
                        py: { xs: 3, sm: 6 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center" sx={{ color: "#fff", textShadow: "0 2px 6px #181f3b" }}>
                        Хронология
                    </Typography>
                    <VerticalTimeline lineColor="#1976d2">
                        {events.map((e, i) => (
                            <VerticalTimelineElement
                                key={i}
                                date={<span style={whiteDateStyle}>{e.date}</span>}
                                contentStyle={{
                                    background: "rgba(255,255,255,0.97)",
                                    color: "#212121",
                                    boxShadow: "0 3px 20px 0 #0002",
                                    borderRadius: 15,
                                }}
                                contentArrowStyle={{ borderRight: '7px solid  #fff' }}
                                iconStyle={{ background: "#1976d2", color: "#fff" }}
                            >
                                <Typography variant="h6" fontWeight="bold">{e.title}</Typography>
                                <Typography variant="body2">{e.description}</Typography>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>
                </Box>
            </Box>
            <SectionNavigation
                next={{ href: "/biography", label: "Биография" }}
            />
        </Container>
    );
}
