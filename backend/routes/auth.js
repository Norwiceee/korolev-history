import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'korolev_super_secret';

// Хелпер для поиска юзера по email
async function findUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

router.get("/has-admin", async (req, res) => {
    const { rows } = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    res.json({ hasAdmin: Number(rows[0].count) > 0 });
});

// Регистрация
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
        return res.status(400).json({ message: "Заполните все поля" });

    const existing = await findUserByEmail(email);
    if (existing)
        return res.status(400).json({ message: "Пользователь с таким email уже существует" });

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, hash, role]
    );
    const user = result.rows[0];

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.json({
        message: "Успешно зарегистрирован",
        token,
        user
    });
});

// Логин
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Неверный логин или пароль" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Неверный логин или пароль" });

    const { id, name, role } = user;
    const token = jwt.sign({ id, name, email, role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
        message: "Успешно авторизован",
        token,
        user: { id, name, email, role }
    });
});

// ----------- ДОБАВЛЕНЫ ЛОГИ ----------------
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('requireAuth: no auth header');
        return res.status(401).json({ error: "Требуется авторизация" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        // ЛОГ ВСЕГО ЮЗЕРА
        console.log('requireAuth: decoded user:', user);
        next();
    } catch (err) {
        console.log('requireAuth: invalid token:', err.message);
        return res.status(401).json({ error: "Неверный токен" });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        // ЛОГ РОЛИ
        console.log('requireRole: role in token:', req.user && req.user.role, 'required:', role);
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: 'Нет доступа (требуется роль: ' + role + ')' });
        }
        next();
    };
}

export { requireAuth, requireRole };
export default router;