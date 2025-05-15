import React, { useState } from "react";
import {
    Container, Typography, Box, Paper, Button, RadioGroup, FormControlLabel,
    Radio, Stepper, Step, StepLabel, Fade, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SectionNavigation } from "../components/SectionNavigation";

const questions = [
    {
        question: "Какое настоящее имя носил Королёв?",
        options: [
            "Сергей Павлович Королёв",
            "Юрий Алексеевич Гагарин",
            "Валентин Петрович Глушко",
            "Константин Эдуардович Циолковский"
        ],
        answer: 0,
        explanation: "Правильно! Сергей Павлович Королёв — главный конструктор советской космонавтики."
    },
    {
        question: "Как назывался первый искусственный спутник Земли?",
        options: [
            "Восток-1",
            "Союз",
            "Спутник-1",
            "Луна-2"
        ],
        answer: 2,
        explanation: "Верно! 'Спутник-1' был запущен 4 октября 1957 года."
    },
    {
        question: "В каком году состоялся первый полёт человека в космос?",
        options: [
            "1957",
            "1961",
            "1969",
            "1971"
        ],
        answer: 1,
        explanation: "Юрий Гагарин совершил первый полёт 12 апреля 1961 года."
    },
    {
        question: "Какая ракета доставила Гагарина на орбиту?",
        options: [
            "Р-7",
            "Сатурн-V",
            "Восток",
            "Энергия"
        ],
        answer: 2,
        explanation: "Правильный ответ — 'Восток'. Это была модифицированная ракета Р-7."
    },
    {
        question: "Где родился С.П. Королёв?",
        options: [
            "Москва",
            "Житомир",
            "Байконур",
            "Самара"
        ],
        answer: 1,
        explanation: "Королёв родился в городе Житомир."
    }
];

export default function QuizPage() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOptionChange = (value) => {
        const updated = [...answers];
        updated[step] = parseInt(value, 10);
        setAnswers(updated);
    };

    const handleNext = () => {
        if (step < questions.length - 1) setStep(step + 1);
        else setShowResult(true);
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleRestart = () => {
        setStep(0);
        setAnswers(Array(questions.length).fill(null));
        setShowResult(false);
    };

    const score = answers.reduce((acc, ans, idx) => (
        ans === questions[idx].answer ? acc + 1 : acc
    ), 0);

    // Диалог с объяснением
    const [explanationOpen, setExplanationOpen] = useState(false);

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Викторина о Королёве и космосе
                </Typography>

                {!showResult ? (
                    <>
                        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
                            {questions.map((q, idx) => (
                                <Step key={idx}>
                                    <StepLabel />
                                </Step>
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
                                {answers[step] !== null && (
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
                            <Button
                                variant="outlined"
                                disabled={step === 0}
                                onClick={handlePrev}
                            >Назад</Button>
                            <Button
                                variant="contained"
                                disabled={answers[step] === null}
                                onClick={handleNext}
                            >
                                {step === questions.length - 1 ? "Показать результат" : "Далее"}
                            </Button>
                        </Box>

                        {/* Пояснение (модалка) */}
                        <Dialog
                            open={explanationOpen}
                            onClose={() => setExplanationOpen(false)}
                            maxWidth="sm"
                        >
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
                        <Typography sx={{ mb: 4 }}>
                            {score === questions.length
                                ? "Отлично! Вы знаете всё о Королёве и космонавтике."
                                : score >= questions.length / 2
                                    ? "Хороший результат, но есть что узнать ещё!"
                                    : "Похоже, пора перечитать историю космоса :)"}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRestart}
                        >
                            Пройти ещё раз
                        </Button>
                    </Box>
                )}
            </Paper>
            <SectionNavigation
                prev={{ href: "/documents", label: "Документы" }}
                next={{ href: "/timeline", label: "Хронология" }}
            />
        </Container>

    );
}
