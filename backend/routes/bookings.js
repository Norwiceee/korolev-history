import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "./auth.js";

const router = express.Router();

// Получить список слотов (GET /api/bookings/slots)
router.get('/slots', async (req, res) => {
    try {
        const slots = await db.query('SELECT * FROM booking_slots ORDER BY slot_datetime ASC');
        res.json(slots.rows);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения слотов' });
    }
});

// Добавить слот (POST /api/bookings/slots)
router.post('/slots', requireAuth, requireRole('admin'), async (req, res) => {
    const { slot_datetime, capacity, event_title, description } = req.body;
    if (!slot_datetime || !capacity || !event_title) {
        return res.status(400).json({ error: 'Данные не полные' });
    }
    try {
        await db.query(
            'INSERT INTO booking_slots (slot_datetime, capacity, event_title, description) VALUES ($1, $2, $3, $4)',
            [slot_datetime, capacity, event_title, description || '']
        );
        res.json({ message: 'Слот добавлен' });
    } catch (err) {
        console.error('Ошибка создания слота:', err);
        res.status(500).json({ error: 'Ошибка создания слота', details: err.message });
    }
});

// Получить свои брони (авторизованный пользователь)
router.get('/', requireAuth, async (req, res) => {
    const user_id = req.user.id;
    try {
        const bookings = await db.query(
            `SELECT b.*, s.slot_datetime, s.description FROM bookings b
             JOIN booking_slots s ON b.slot_id = s.id
             WHERE b.user_id = $1 ORDER BY s.slot_datetime ASC`,
            [user_id]
        );
        res.json(bookings.rows);
    } catch (err) {
        console.error('Ошибка получения бронирований:', err);
        res.status(500).json({ error: 'Ошибка получения бронирований' });
    }
});

// (Админ) Получить все брони
router.get('/all', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const bookings = await db.query(
            `SELECT b.*, u.email, s.slot_datetime, s.description
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN booking_slots s ON b.slot_id = s.id
             ORDER BY s.slot_datetime ASC`
        );
        res.json(bookings.rows);
    } catch (err) {
        console.error('Ошибка получения всех бронирований:', err);
        res.status(500).json({ error: 'Ошибка получения всех бронирований' });
    }
});

// Создать бронь (авторизованный пользователь)
router.post('/', requireAuth, async (req, res) => {
    const user_id = req.user.id;
    const { slot_id, ticket_count, comment } = req.body;
    if (!slot_id || !ticket_count) {
        return res.status(400).json({ error: 'Не указан слот или количество билетов' });
    }
    try {
        // Проверка доступности слота
        const slotRes = await db.query('SELECT * FROM booking_slots WHERE id = $1', [slot_id]);
        const slot = slotRes.rows[0];
        if (!slot) return res.status(404).json({ error: 'Слот не найден' });
        if ((slot.booked_count + ticket_count) > slot.capacity) {
            return res.status(400).json({ error: 'Недостаточно свободных мест' });
        }

        // Создать бронь
        await db.query(
            'INSERT INTO bookings (user_id, slot_id, ticket_count, comment, status) VALUES ($1, $2, $3, $4, $5)',
            [user_id, slot_id, ticket_count, comment || '', 'pending']
        );
        await db.query(
            'UPDATE booking_slots SET booked_count = booked_count + $1 WHERE id = $2',
            [ticket_count, slot_id]
        );
        res.json({ message: 'Бронь создана' });
    } catch (err) {
        console.error('Ошибка создания брони:', err);
        res.status(500).json({ error: 'Ошибка создания брони' });
    }
});

// (Админ) Обновить статус брони
router.patch('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Некорректный статус' });
    }
    try {
        await db.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);
        res.json({ message: 'Статус обновлён' });
    } catch (err) {
        console.error('Ошибка обновления статуса:', err);
        res.status(500).json({ error: 'Ошибка обновления статуса' });
    }
});

// (Админ) Удалить слот (мероприятие) с поддержкой force=1
router.delete('/slots/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const { id } = req.params;
    const force = req.query.force === "1" || req.query.force === "true";
    try {
        const bookingsRes = await db.query('SELECT COUNT(*) as count FROM bookings WHERE slot_id = $1', [id]);
        const bookingsCount = Number(bookingsRes.rows[0].count);

        if (bookingsCount > 0 && !force) {
            return res.status(400).json({ error: 'Слот уже содержит бронирования' });
        }

        let deletedCount = 0;
        if (bookingsCount > 0 && force) {
            const del = await db.query('DELETE FROM bookings WHERE slot_id = $1 RETURNING id', [id]);
            deletedCount = del.rows.length;
        }

        await db.query('DELETE FROM booking_slots WHERE id = $1', [id]);
        res.json({ message: 'Слот и связанные бронирования удалены', bookingsDeleted: deletedCount });
    } catch (err) {
        console.error('Ошибка удаления слота:', err);
        res.status(500).json({ error: 'Ошибка удаления слота' });
    }
});

// (Админ) Отмена брони (и возврат мест в слоте)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const bookingRes = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
        const booking = bookingRes.rows[0];
        if (!booking) return res.status(404).json({ error: 'Бронь не найдена' });
        await db.query(
            'UPDATE booking_slots SET booked_count = booked_count - $1 WHERE id = $2',
            [booking.ticket_count, booking.slot_id]
        );
        await db.query('DELETE FROM bookings WHERE id = $1', [id]);
        res.json({ message: 'Бронь отменена и удалена' });
    } catch (err) {
        console.error('Ошибка отмены брони:', err);
        res.status(500).json({ error: 'Ошибка отмены брони' });
    }
});

// (Админ) Редактировать слот
router.patch('/slots/:id', requireAuth, requireRole('admin'), async (req, res) => {
    const { id } = req.params;
    const { slot_datetime, capacity, event_title, description } = req.body;
    try {
        const fields = [];
        const values = [];
        let idx = 1;
        if (slot_datetime !== undefined) { fields.push(`slot_datetime = $${idx++}`); values.push(slot_datetime); }
        if (capacity !== undefined)     { fields.push(`capacity = $${idx++}`);     values.push(capacity); }
        if (event_title !== undefined)  { fields.push(`event_title = $${idx++}`);  values.push(event_title); }
        if (description !== undefined)  { fields.push(`description = $${idx++}`);  values.push(description); }
        if (!fields.length) return res.status(400).json({ error: 'Нет данных для обновления' });
        values.push(id);
        await db.query(`UPDATE booking_slots SET ${fields.join(', ')} WHERE id = $${idx}`, values);
        res.json({ message: 'Слот обновлён' });
    } catch (err) {
        console.error('Ошибка редактирования слота:', err);
        res.status(500).json({ error: 'Ошибка обновления слота' });
    }
});

export default router;