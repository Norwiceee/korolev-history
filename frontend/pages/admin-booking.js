import React, { useEffect, useState } from "react";
import {
    Container, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid
} from "@mui/material";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/router";

export default function AdminBookings() {
    const { user } = useAuth();
    const router = useRouter();

    // Для бронирований пользователей
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Для мероприятий (слоты)
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(true);

    // Для добавления слота
    const [newSlot, setNewSlot] = useState({
        event_title: "",
        slot_datetime: "",
        capacity: 10,
        description: ""
    });
    const [slotMsg, setSlotMsg] = useState("");

    // Для редактирования слота
    const [editDialog, setEditDialog] = useState(false);
    const [editSlot, setEditSlot] = useState(null);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.replace("/");
            return;
        }
        // Бронирования
        fetch("http://89.104.65.59:4000/api/bookings/all", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(setBookings)
            .finally(() => setLoading(false));

        // Слоты (мероприятия)
        fetchSlots();
    }, [user]);

    // Получение всех слотов
    const fetchSlots = () => {
        setSlotsLoading(true);
        fetch("http://89.104.65.59:4000/api/bookings/slots")
            .then(res => res.json())
            .then(setSlots)
            .finally(() => setSlotsLoading(false));
    };

    // Добавить новый слот
    const handleAddSlot = async (e) => {
        e.preventDefault();
        setSlotMsg("");
        const res = await fetch("http://89.104.65.59:4000/api/bookings/slots", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(newSlot)
        });
        const data = await res.json();
        if (res.ok) {
            setNewSlot({ event_title: "", slot_datetime: "", capacity: 10, description: "" });
            setSlotMsg("Мероприятие добавлено");
            fetchSlots();
        } else {
            setSlotMsg(data.error || "Ошибка");
        }
    };

    // Открыть диалог редактирования
    const handleOpenEditSlot = (slot) => {
        setEditSlot({ ...slot, slot_datetime: slot.slot_datetime ? slot.slot_datetime.slice(0, 16) : "" });
        setEditDialog(true);
    };

    // Сохранить изменения слота
    const handleEditSlot = async () => {
        const res = await fetch(`http://89.104.65.59:4000/api/bookings/slots/${editSlot.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                slot_datetime: editSlot.slot_datetime,
                capacity: editSlot.capacity,
                event_title: editSlot.event_title,
                description: editSlot.description,
            })
        });
        const data = await res.json();
        if (res.ok) {
            setEditDialog(false);
            fetchSlots();
        } else {
            alert(data.error || "Ошибка");
        }
    };

    // Удалить слот (мероприятие) — с подтверждением, если есть бронирования
    const handleDeleteSlot = async (id) => {
        const slot = slots.find(s => s.id === id);
        if (!slot) return;

        if (slot.booked_count > 0) {
            if (!window.confirm(
                `На это мероприятие уже есть ${slot.booked_count} бронирований!\nУдалить мероприятие вместе со всеми этими бронированиями?`
            )) return;

            // Удалить с параметром force
            const res = await fetch(`http://89.104.65.59:4000/api/bookings/slots/${id}?force=1`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            if (res.ok) {
                fetchSlots();
                alert(`Удалено мероприятие и ${data.bookingsDeleted || 0} бронирований`);
            } else {
                alert(data.error || "Ошибка удаления");
            }
        } else {
            if (!window.confirm("Удалить это мероприятие?")) return;
            const res = await fetch(`http://89.104.65.59:4000/api/bookings/slots/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            if (res.ok) {
                fetchSlots();
                alert("Мероприятие удалено");
            } else {
                alert(data.error || "Ошибка удаления");
            }
        }
    };

    // Изменить статус брони
    const handleStatus = (id, status) => {
        fetch(`http://89.104.65.59:4000/api/bookings/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ status })
        })
            .then(() => {
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
                setOpenStatusDialog(false);
            });
    };

    if (!user || user.role !== "admin") return null;

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Управление бронированиями и мероприятиями
            </Typography>

            {/* Блок добавления мероприятия (слота) */}
            <Paper elevation={4} sx={{ p: 3, mb: 5, borderRadius: 3 }}>
                <form onSubmit={handleAddSlot}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Наименование мероприятия"
                                value={newSlot.event_title}
                                onChange={e => setNewSlot(s => ({ ...s, event_title: e.target.value }))}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Дата и время"
                                type="datetime-local"
                                value={newSlot.slot_datetime}
                                onChange={e => setNewSlot(s => ({ ...s, slot_datetime: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <TextField
                                label="Вместимость"
                                type="number"
                                value={newSlot.capacity}
                                onChange={e => setNewSlot(s => ({ ...s, capacity: +e.target.value }))}
                                required
                                fullWidth
                                inputProps={{ min: 1, max: 1000 }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <TextField
                                label="Описание"
                                value={newSlot.description}
                                onChange={e => setNewSlot(s => ({ ...s, description: e.target.value }))}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: 56 }}>
                                Добавить
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {slotMsg && <Typography color="info.main" sx={{ mt: 1 }}>{slotMsg}</Typography>}
            </Paper>

            {/* Список мероприятий (слотов) */}
            <Typography variant="h6" sx={{ mb: 1 }}>Список мероприятий</Typography>
            {slotsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 6 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Наименование</TableCell>
                                <TableCell>Дата и время</TableCell>
                                <TableCell>Вместимость</TableCell>
                                <TableCell>Занято</TableCell>
                                <TableCell>Описание</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slots.map((slot) => (
                                <TableRow key={slot.id}>
                                    <TableCell>{slot.event_title}</TableCell>
                                    <TableCell>{slot.slot_datetime && (new Date(slot.slot_datetime)).toLocaleString()}</TableCell>
                                    <TableCell>{slot.capacity}</TableCell>
                                    <TableCell>{slot.booked_count}</TableCell>
                                    <TableCell>{slot.description}</TableCell>
                                    <TableCell>
                                        <Button size="small" color="primary" variant="outlined"
                                                onClick={() => handleOpenEditSlot(slot)}
                                                sx={{ mr: 1 }}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button size="small" color="error" variant="outlined"
                                                onClick={() => handleDeleteSlot(slot.id)}
                                        >
                                            Удалить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Модалка редактирования мероприятия */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
                <DialogTitle>Редактировать мероприятие</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 350 }}>
                    <TextField
                        label="Наименование"
                        value={editSlot?.event_title || ""}
                        onChange={e => setEditSlot(s => ({ ...s, event_title: e.target.value }))}
                    />
                    <TextField
                        label="Дата и время"
                        type="datetime-local"
                        value={editSlot?.slot_datetime || ""}
                        onChange={e => setEditSlot(s => ({ ...s, slot_datetime: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Вместимость"
                        type="number"
                        value={editSlot?.capacity || 1}
                        onChange={e => setEditSlot(s => ({ ...s, capacity: +e.target.value }))}
                    />
                    <TextField
                        label="Описание"
                        value={editSlot?.description || ""}
                        onChange={e => setEditSlot(s => ({ ...s, description: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditSlot} variant="contained" color="primary">
                        Сохранить
                    </Button>
                    <Button onClick={() => setEditDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>

            {/* Таблица всех бронирований */}
            <Typography variant="h6" sx={{ mb: 2 }}>Все бронирования пользователей</Typography>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Пользователь</TableCell>
                                <TableCell>Мероприятие</TableCell>
                                <TableCell>Дата и время</TableCell>
                                <TableCell>Билетов</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Комментарий</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell>{b.email || b.user_id}</TableCell>
                                    <TableCell>{b.event_title || b.description || b.slot_id}</TableCell>
                                    <TableCell>{b.slot_datetime && (new Date(b.slot_datetime)).toLocaleString()}</TableCell>
                                    <TableCell>{b.ticket_count}</TableCell>
                                    <TableCell>{b.status}</TableCell>
                                    <TableCell>{b.comment}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ mr: 1 }}
                                            onClick={() => {
                                                setSelectedBooking(b);
                                                setOpenStatusDialog(true);
                                            }}
                                        >
                                            Изменить статус
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* Модалка изменения статуса */}
            <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
                <DialogTitle>Изменить статус бронирования</DialogTitle>
                <DialogContent>
                    <Typography>
                        Новый статус для заявки пользователя: <b>{selectedBooking?.email || selectedBooking?.user_id}</b>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleStatus(selectedBooking.id, "confirmed")} color="success">
                        Подтвердить
                    </Button>
                    <Button onClick={() => handleStatus(selectedBooking.id, "cancelled")} color="error">
                        Отменить
                    </Button>
                    <Button onClick={() => setOpenStatusDialog(false)}>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}