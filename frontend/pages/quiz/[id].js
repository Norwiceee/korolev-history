import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Container, Typography, Paper, Button, RadioGroup, FormControlLabel,
    Radio, Stepper, Step, StepLabel, Fade, Dialog, DialogTitle, DialogContent, IconButton, Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SectionNavigation } from "../../components/SectionNavigation";
import { useAuth } from "../../components/AuthContext"; // ОБЯЗАТЕЛЬНО!

export default function QuizPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user, token } = useAuth();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [explanationOpen, setExplanationOpen] = useState(false);
    const [resultSaved, setResultSaved] = useState(false);

    // --- ГЛАВНЫЙ useEffect ---
    useEffect(() => {
        if (!id) return;

        // Получаем данные о квизе
        fetch(`http://89.104.65.59:4000/api/quizzes/${id}`)
            .then(res => res.json())
            .then(setQuiz);

        // Получаем вопросы
        fetch(`http://89.104.65.59:4000/api/quizzes/${id}/questions`)
            .then(res => res.json())
            .then(qs => {
                setQuestions(qs);
                setAnswers(Array(qs.length).fill(null));
            });
    }, [id]);

    // --- СОХРАНЯЕМ результат после завершения ---
    useEffect(() => {
        if (
            showResult &&
            user &&
            token &&
            questions.length > 0 &&
            !resultSaved
        ) {
            // Подсчёт баллов
            const score = answers.reduce(
                (acc, ans, idx) => ans === questions[idx].correct_option ? acc + 1 : acc,
                0
            );

            fetch(`http://89.104.65.59:4000/api/quizzes/${id}/results`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ score })
            })
                .then(res => {
                    if (res.ok) setResultSaved(true);
                    // Можно добавить обработку ошибок по желанию
                });
        }
        // eslint-disable-next-line
    }, [showResult, user, token, id, questions, answers, resultSaved]);

    if (!quiz || !questions.length) return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Typography>Загрузка...</Typography>
        </Container>
    );

    const handleOptionChange = (value) => {
        const updated = [...answers];
        updated[step] = parseInt(value, 10);
        setAnswers(updated);
    };

    const handleNext = () => {
        if (step < questions.length - 1) setStep(step + 1);
        else setShowResult(true);
    };

    const handlePrev = () => { if (step > 0) setStep(step - 1); };
    const handleRestart = () => {
        setStep(0);
        setAnswers(Array(questions.length).fill(null));
        setShowResult(false);
        setResultSaved(false);
    };

    const score = answers.reduce((acc, ans, idx) => (
        ans === questions[idx].correct_option ? acc + 1 : acc
    ), 0);

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {quiz.title}
                </Typography>
                {!showResult ? (
                    <>
                        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
                            {questions.map((_, idx) => (
                                <Step key={idx}><StepLabel /></Step>
                            ))}
                        </Stepper>
                        <Fade in>
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    {questions[step].question}
                                </Typography>
                                <RadioGroup
                                    value={answers[step] !== null ? String(answers[step]) : ''}
                                    onChange={(e) => handleOptionChange(e.target.value)}
                                >
                                    {questions[step].options.map((option, idx) => (
                                        <FormControlLabel
                                            key={idx}
                                            value={String(idx)}
                                            control={<Radio />}
                                            label={option}
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </RadioGroup>
                                {answers[step] !== null && questions[step].explanation && (
                                    <Button
                                        variant="text"
                                        color="primary"
                                        sx={{ mt: 1 }}
                                        onClick={() => setExplanationOpen(true)}
                                    >
                                        Пояснение
                                    </Button>
                                )}
                            </Box>
                        </Fade>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                            <Button variant="outlined" disabled={step === 0} onClick={handlePrev}>Назад</Button>
                            <Button
                                variant="contained"
                                disabled={answers[step] === null}
                                onClick={handleNext}
                            >
                                {step === questions.length - 1 ? "Показать результат" : "Далее"}
                            </Button>
                        </Box>
                        <Dialog open={explanationOpen} onClose={() => setExplanationOpen(false)} maxWidth="sm">
                            <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                                <Box flex={1}>Пояснение</Box>
                                <IconButton onClick={() => setExplanationOpen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <Typography>
                                    {questions[step].explanation}
                                </Typography>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                            Ваш результат: {score} из {questions.length}
                        </Typography>
                        <Button variant="contained" size="large" onClick={handleRestart}>
                            Пройти ещё раз
                        </Button>
                    </Box>
                )}
            </Paper>
            <SectionNavigation prev={{ href: "/documents", label: "Документы" }} next={null} />
        </Container>
    );
}
