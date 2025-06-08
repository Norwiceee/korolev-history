import { useAuth } from "../components/AuthContext";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Box, Paper, Typography, Button, Container, Grid, TextField,
    Alert, MenuItem, Stack,
    Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, DialogActions // ← вот это!
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MuseumIcon from "@mui/icons-material/Museum"; // для карточек

export default function BookingsPage() {
    const { user, token } = useAuth();
    const [slots, setSlots] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [message, setMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetch('http://89.104.65.59:4000/api/bookings/slots')
            .then(res => res.json())
            .then(setSlots);

        if (user) {
            fetch('http://89.104.65.59:4000/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(setMyBookings);
        }
    }, [user, token]);

    // Открытие формы бронирования для слота
    const handleOpenBooking = (slot) => {
        setSelectedSlot(slot);
        setTicketCount(1);
        setOpenDialog(true);
        setMessage("");
    };

    // Отправка бронирования
    const handleBooking = async (e) => {
        e.preventDefault();
        setMessage("");
        const res = await fetch('http://89.104.65.59:4000/api/bookings', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ slot_id: selectedSlot.id, ticket_count: ticketCount })
        });
        const data = await res.json();
        if (res.ok) {
            setMessage("Бронь успешно создана!");
            setOpenDialog(false);
            fetch('http://89.104.65.59:4000/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(setMyBookings);
        } else {
            setMessage(data.error || "Ошибка бронирования");
        }
    };

    if (!user)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <Paper elevation={4} sx={{ p: 5, borderRadius: 3, textAlign: "center", minWidth: 320 }}>
                    <Typography variant="h5" gutterBottom>
                        Только для авторизованных
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        Войдите в аккаунт, чтобы забронировать билет в музей.
                    </Typography>
                    <Button variant="contained" component={Link} href="/login" sx={{ mb: 1, px: 5 }}>
                        Войти
                    </Button>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Нет аккаунта?{" "}
                            <Link href="/register" style={{ color: "#3949ab", textDecoration: "underline" }}>
                                Зарегистрируйтесь
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        );

    return (
        <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
            <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventAvailableIcon color="primary" sx={{ mr: 1, fontSize: 36 }} />
                    <Typography variant="h4" fontWeight={700}>
                        Выбор мероприятия для бронирования билетов
                    </Typography>
                </Box>

                {/* Карточки мероприятий */}
                <Grid container spacing={4} sx={{ mb: 3 }}>
                    {slots.map(slot => (
                        <Grid item xs={12} sm={6} md={4} key={slot.id}>
                            <Paper elevation={4} sx={{
                                p: 3,
                                borderRadius: 3,
                                textAlign: "center",
                                position: "relative"
                            }}>
                                <MuseumIcon sx={{ fontSize: 48, color: "#3949ab", mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    {slot.description || "Мероприятие"}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {new Date(slot.slot_datetime).toLocaleString()}
                                </Typography>
                                <Typography sx={{ mb: 2 }}>
                                    Свободно мест: <b>{slot.capacity - slot.booked_count}</b>
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleOpenBooking(slot)}
                                    disabled={slot.capacity - slot.booked_count <= 0}
                                >
                                    Забронировать
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Модальное окно с формой бронирования */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Бронирование билета</DialogTitle>
                    <DialogContent>
                        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
                        {selectedSlot && (
                            <form onSubmit={handleBooking}>
                                <Typography sx={{ mb: 1 }}>
                                    <b>{selectedSlot.description || "Мероприятие"}</b>
                                </Typography>
                                <Typography sx={{ mb: 2 }}>
                                    {new Date(selectedSlot.slot_datetime).toLocaleString()}
                                </Typography>
                                <TextField
                                    label="Количество билетов"
                                    type="number"
                                    min={1}
                                    max={Math.max(1, selectedSlot.capacity - selectedSlot.booked_count)}
                                    value={ticketCount}
                                    onChange={e => setTicketCount(Number(e.target.value))}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={ticketCount < 1 || ticketCount > (selectedSlot.capacity - selectedSlot.booked_count)}
                                >
                                    Подтвердить бронь
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                    Мои бронирования
                </Typography>
                {myBookings.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        У вас пока нет бронирований.
                    </Typography>
                ) : (
                    <Paper elevation={1} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Билеты</TableCell>
                                    <TableCell>Статус</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myBookings.map(b => (
                                    <TableRow key={b.id}>
                                        <TableCell>{new Date(b.slot_datetime).toLocaleString()}</TableCell>
                                        <TableCell>{b.ticket_count}</TableCell>
                                        <TableCell>
                                            {b.status === "pending" && (
                                                <Typography color="warning.main">ожидает</Typography>
                                            )}
                                            {b.status === "confirmed" && (
                                                <Typography color="success.main">подтверждено</Typography>
                                            )}
                                            {b.status === "cancelled" && (
                                                <Typography color="error.main">отменено</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
}
