import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Grid, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import { SectionNavigation } from "../components/SectionNavigation";

export default function QuizListPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:4000/api/quizzes")
            .then(res => res.json())
            .then(setQuizzes)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Викторины
            </Typography>
            <Typography align="center" sx={{ mb: 4 }}>
                Выберите викторину для прохождения:
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {quizzes.map(q => (
                    <Grid item xs={12} sm={6} md={4} key={q.id}>
                        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
                            <Typography variant="h6" gutterBottom>{q.title}</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>{q.description}</Typography>
                            <Button
                                variant="contained"
                                onClick={() => router.push(`/quiz/${q.id}`)}
                            >
                                Пройти викторину
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <SectionNavigation prev={{ href: "/documents", label: "Документы" }} next={null} />
        </Container>
    );
}
