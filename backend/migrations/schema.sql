-- Удаляем старые таблицы, если есть (в правильном порядке!)
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS booking_slots CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS timeline CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS museums CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS documents CASCADE;

-- Пользователи
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       password TEXT NOT NULL,
                       role TEXT CHECK (role IN ('admin', 'client')) NOT NULL,
                       created_at TIMESTAMP DEFAULT NOW()
);

-- Квизы (разделы, каждой викторине соответствует набор вопросов)
CREATE TABLE quizzes (
                         id SERIAL PRIMARY KEY,
                         title VARCHAR(200) NOT NULL,
                         description TEXT
);

-- Квиз-вопросы (каждый связан с квизом через quiz_id)
CREATE TABLE quiz_questions (
                                id SERIAL PRIMARY KEY,
                                quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
                                question TEXT NOT NULL,
                                options TEXT[] NOT NULL,
                                correct_option INTEGER NOT NULL,
                                explanation TEXT
);


-- Результаты квизов
CREATE TABLE quiz_results (
                              id SERIAL PRIMARY KEY,
                              user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                              quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
                              score INTEGER,
                              submitted_at TIMESTAMP DEFAULT NOW()
);

-- Фидбек
CREATE TABLE feedback (
                          id SERIAL PRIMARY KEY,
                          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                          name VARCHAR(100),
                          email VARCHAR(100),
                          message TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT NOW()
);

-- CMS-страницы
CREATE TABLE pages (
                       id SERIAL PRIMARY KEY,
                       slug VARCHAR(50) UNIQUE,
                       title VARCHAR(200),
                       content TEXT,
                       type VARCHAR(50)
);

-- Галерея
CREATE TABLE gallery (
                         id SERIAL PRIMARY KEY,
                         image_url VARCHAR(300) NOT NULL,
                         description TEXT,
                         uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Таймлайн
CREATE TABLE timeline (
                          id SERIAL PRIMARY KEY,
                          event_date DATE NOT NULL,
                          title VARCHAR(200) NOT NULL,
                          description TEXT
);

-- Новости
CREATE TABLE news (
                      id SERIAL PRIMARY KEY,
                      title VARCHAR(200) NOT NULL,
                      content TEXT NOT NULL,
                      created_at TIMESTAMP DEFAULT NOW(),
                      author_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Музеи (интеграция)
CREATE TABLE museums (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(200) NOT NULL,
                         address TEXT,
                         description TEXT,
                         website VARCHAR(200)
);

-- Слоты расписания для бронирования
CREATE TABLE booking_slots (
                               id SERIAL PRIMARY KEY,
                               slot_datetime TIMESTAMP NOT NULL,
                               capacity INTEGER NOT NULL,
                               booked_count INTEGER DEFAULT 0,
                               event_title VARCHAR(200) DEFAULT '',
                               description TEXT
);


-- Бронирования
CREATE TABLE bookings (
                          id SERIAL PRIMARY KEY,
                          user_id INTEGER NOT NULL REFERENCES users(id),
                          slot_id INTEGER NOT NULL REFERENCES booking_slots(id),
                          ticket_count INTEGER NOT NULL,
                          status TEXT DEFAULT 'pending',
                          comment TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Лог изменений
CREATE TABLE logs (
                      id SERIAL PRIMARY KEY,
                      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                      action TEXT,
                      created_at TIMESTAMP DEFAULT NOW()
);

-- Документы (PDF и пр.)
CREATE TABLE documents (
                           id SERIAL PRIMARY KEY,
                           title VARCHAR(200) NOT NULL,
                           description TEXT,
                           date DATE,
                           source TEXT,
                           file_path TEXT NOT NULL,
                           created_at TIMESTAMP DEFAULT NOW()
);
