import React, { useState, useEffect } from "react";
import {
    Container, Typography, TextField, Button, Paper, Box, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../components/AuthContext";

export default function AdminQuizPage() {
    const { user, token } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuizId, setActiveQuizId] = useState("");
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctOption, setCorrectOption] = useState(0);
    const [message, setMessage] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    // Получить все квизы
    const fetchQuizzes = () => {
        fetch("http://89.104.65.59:4000/api/quizzes")
            .then(res => res.json())
            .then(data => {
                setQuizzes(data);
                if (!activeQuizId && data.length > 0) setActiveQuizId(data[0].id);
            });
    };

    // Получить вопросы выбранного квиза
    const fetchQuestions = (quizId) => {
        if (!quizId) return setQuestions([]);
        fetch(`http://89.104.65.59:4000/api/quizzes/${quizId}/questions`)
            .then(res => res.json())
            .then(setQuestions);
    };

    useEffect(() => {
        if (user?.role === "admin") fetchQuizzes();
    }, [user]);

    useEffect(() => {
        if (activeQuizId) fetchQuestions(activeQuizId);
    }, [activeQuizId]);

    if (!user || user.role !== "admin") return <Typography>Нет доступа</Typography>;

    // --- Создать новый квиз ---
    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setMessage("");
        const res = await fetch("http://89.104.65.59:4000/api/quizzes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: quizTitle,
                description: quizDescription
            })
        });
        const data = await res.json();
        if (res.ok) {
            setQuizTitle("");
            setQuizDescription("");
            fetchQuizzes();
            setMessage("Квиз создан!");
        } else {
            setMessage(data.error || "Ошибка");
        }
    };

    // --- Работа с вопросами ---
    const handleOptionChange = (idx, value) => {
        const updated = [...options];
        updated[idx] = value;
        setOptions(updated);
    };
    const handleAddOption = () => setOptions([...options, ""]);
    const handleRemoveOption = (idx) => {
        if (options.length > 2) {
            const updated = options.filter((_, i) => i !== idx);
            setOptions(updated);
            if (correctOption >= updated.length) setCorrectOption(updated.length - 1);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!activeQuizId) return setMessage("Сначала выберите квиз.");
        const res = await fetch(`http://89.104.65.59:4000/api/quizzes/${activeQuizId}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                question,
                options,
                correct_option: Number(correctOption)
            })
        });
        const data = await res.json();
        if (res.ok) {
            setMessage("Вопрос добавлен!");
            setQuestion("");
            setOptions(["", ""]);
            setCorrectOption(0);
            fetchQuestions(activeQuizId);
        } else {
            setMessage(data.error || "Ошибка");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить этот вопрос?")) return;
        await fetch(`http://89.104.65.59:4000/api/quizzes/${activeQuizId}/questions/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchQuestions(activeQuizId);
    };

    // --- Редактирование ---
    const openEditDialog = (q) => {
        setEditId(q.id);
        setQuestion(q.question);
        setOptions([...q.options]);
        setCorrectOption(q.correct_option);
        setEditDialogOpen(true);
    };
    const closeEditDialog = () => {
        setEditId(null);
        setQuestion("");
        setOptions(["", ""]);
        setCorrectOption(0);
        setEditDialogOpen(false);
    };

    const handleEditQuestion = async (e) => {
        e.preventDefault();
        if (!editId) return;
        const res = await fetch(`http://89.104.65.59:4000/api/quizzes/${activeQuizId}/questions/${editId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                question,
                options,
                correct_option: Number(correctOption)
            })
        });
        if (res.ok) {
            setMessage("Вопрос обновлён!");
            closeEditDialog();
            fetchQuestions(activeQuizId);
        } else {
            setMessage("Ошибка обновления!");
        }
    };


    return (

        <Container maxWidth="sm" sx={{ py: 5 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Все квизы
                </Typography>
                <List>
                    {quizzes.map(q => (
                        <ListItem
                            key={q.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    color="error"
                                    onClick={async () => {
                                        if (window.confirm(`Удалить квиз "${q.title}" и все вопросы?`)) {
                                            await fetch(`http://89.104.65.59:4000/api/quizzes/${q.id}`, {
                                                method: "DELETE",
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            // Сброс активного квиза, если удалили его
                                            if (activeQuizId === q.id) setActiveQuizId("");
                                            fetchQuizzes();
                                            setQuestions([]);
                                            setMessage("Квиз удалён!");
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={q.title}
                                secondary={q.description}
                                onClick={() => setActiveQuizId(q.id)}
                                sx={{
                                    cursor: "pointer",
                                    fontWeight: activeQuizId === q.id ? 700 : 400,
                                    color: activeQuizId === q.id ? "primary.main" : undefined
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Создать новый квиз
                </Typography>
                <form onSubmit={handleCreateQuiz}>
                    <TextField
                        label="Название квиза"
                        value={quizTitle}
                        onChange={e => setQuizTitle(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        label="Описание"
                        value={quizDescription}
                        onChange={e => setQuizDescription(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Создать квиз
                    </Button>
                </form>
            </Paper>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Вопросы выбранного квиза
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="quiz-select-label">Выберите квиз</InputLabel>
                    <Select
                        labelId="quiz-select-label"
                        value={activeQuizId}
                        label="Выберите квиз"
                        onChange={e => setActiveQuizId(e.target.value)}
                    >
                        {quizzes.map(q => (
                            <MenuItem value={q.id} key={q.id}>{q.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <form onSubmit={handleAddQuestion}>
                    <TextField
                        label="Вопрос"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        required
                    />
                    {options.map((opt, idx) => (
                        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <TextField
                                label={`Вариант ${idx + 1}`}
                                value={opt}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                                sx={{ flex: 1, mr: 1 }}
                                required
                            />
                            <Button
                                type="button"
                                onClick={() => handleRemoveOption(idx)}
                                disabled={options.length <= 2}
                            >
                                Удалить
                            </Button>
                        </Box>
                    ))}
                    <Button type="button" onClick={handleAddOption} sx={{ mb: 2 }}>
                        + Добавить вариант
                    </Button>
                    <TextField
                        label="Номер правильного варианта (от 1)"
                        type="number"
                        value={correctOption + 1}
                        onChange={e => setCorrectOption(Number(e.target.value) - 1)}
                        inputProps={{ min: 1, max: options.length }}
                        sx={{ mb: 2 }}
                        fullWidth
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Добавить вопрос
                    </Button>
                </form>
                {message && (
                    <Typography sx={{ mt: 2, color: "green" }}>{message}</Typography>
                )}
                <List sx={{ mt: 4 }}>
                    {questions.map((q, idx) => (
                        <ListItem key={q.id || idx}
                                  secondaryAction={
                                      <>
                                          <IconButton edge="end" color="primary" onClick={() => openEditDialog(q)}>
                                              <EditIcon />
                                          </IconButton>
                                          <IconButton edge="end" color="error" onClick={() => handleDelete(q.id)}>
                                              <DeleteIcon />
                                          </IconButton>
                                      </>
                                  }
                        >
                            <ListItemText
                                primary={q.question}
                                secondary={q.options.map((opt, i) =>
                                    `${i + 1}. ${opt}${i === q.correct_option ? " (правильный)" : ""}`
                                ).join("; ")}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Диалог редактирования */}
            <Dialog open={editDialogOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Редактировать вопрос
                    <IconButton onClick={closeEditDialog} sx={{ position: "absolute", right: 16, top: 16 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditQuestion}>
                        <TextField
                            label="Вопрос"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        {options.map((opt, idx) => (
                            <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <TextField
                                    label={`Вариант ${idx + 1}`}
                                    value={opt}
                                    onChange={e => handleOptionChange(idx, e.target.value)}
                                    sx={{ flex: 1, mr: 1 }}
                                    required
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveOption(idx)}
                                    disabled={options.length <= 2}
                                >
                                    Удалить
                                </Button>
                            </Box>
                        ))}
                        <Button type="button" onClick={handleAddOption} sx={{ mb: 2 }}>
                            + Добавить вариант
                        </Button>
                        <TextField
                            label="Номер правильного варианта (от 1)"
                            type="number"
                            value={correctOption + 1}
                            onChange={e => setCorrectOption(Number(e.target.value) - 1)}
                            inputProps={{ min: 1, max: options.length }}
                            sx={{ mb: 2 }}
                            fullWidth
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Сохранить
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Container>
    );
}
