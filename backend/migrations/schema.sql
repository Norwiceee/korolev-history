-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'client')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    );

-- Таблица квиз-вопросов
CREATE TABLE IF NOT EXISTS quiz_questions (
                                              id SERIAL PRIMARY KEY,
                                              question TEXT NOT NULL,
                                              options TEXT[] NOT NULL,
                                              correct_option INTEGER NOT NULL
);

-- Результаты квиза
CREATE TABLE IF NOT EXISTS quiz_results (
                                            id SERIAL PRIMARY KEY,
                                            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER,
    submitted_at TIMESTAMP DEFAULT NOW()
    );

-- Фидбек от пользователей
CREATE TABLE IF NOT EXISTS feedback (
                                        id SERIAL PRIMARY KEY,
                                        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    );

-- CMS-страницы
CREATE TABLE IF NOT EXISTS pages (
                                     id SERIAL PRIMARY KEY,
                                     slug VARCHAR(50) UNIQUE,
    title VARCHAR(200),
    content TEXT,
    type VARCHAR(50)
    );

-- Галерея
CREATE TABLE IF NOT EXISTS gallery (
                                       id SERIAL PRIMARY KEY,
                                       image_url VARCHAR(300) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
    );

-- Таймлайн
CREATE TABLE IF NOT EXISTS timeline (
                                        id SERIAL PRIMARY KEY,
                                        event_date DATE NOT NULL,
                                        title VARCHAR(200) NOT NULL,
    description TEXT
    );

-- Новости
CREATE TABLE IF NOT EXISTS news (
                                    id SERIAL PRIMARY KEY,
                                    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL
    );

-- Таблица музеев (для интеграции с реальным музеем Королева)
CREATE TABLE IF NOT EXISTS museums (
                                       id SERIAL PRIMARY KEY,
                                       name VARCHAR(200) NOT NULL,
    address TEXT,
    description TEXT,
    website VARCHAR(200)
    );

-- Бронирование билетов
CREATE TABLE IF NOT EXISTS bookings (
                                        id SERIAL PRIMARY KEY,
                                        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    museum_id INTEGER REFERENCES museums(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    tickets_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'reserved'
    );

-- Лог изменений (опционально для админки)
CREATE TABLE IF NOT EXISTS logs (
                                    id SERIAL PRIMARY KEY,
                                    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    );
