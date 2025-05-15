CREATE TABLE IF NOT EXISTS quiz_questions (
                                              id SERIAL PRIMARY KEY,
                                              question TEXT NOT NULL,
                                              options TEXT[] NOT NULL,
                                              correct_option INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_results (
                                            id SERIAL PRIMARY KEY,
                                            username VARCHAR(100),
    score INTEGER,
    submitted_at TIMESTAMP DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS feedback (
                                        id SERIAL PRIMARY KEY,
                                        name VARCHAR(100),
    email VARCHAR(100),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS pages (
                                     id SERIAL PRIMARY KEY,
                                     slug VARCHAR(50) UNIQUE,
    title VARCHAR(200),
    content TEXT,
    type VARCHAR(50)
    );

CREATE TABLE IF NOT EXISTS gallery (
                                       id SERIAL PRIMARY KEY,
                                       image_url VARCHAR(300),
    description TEXT
    );

CREATE TABLE IF NOT EXISTS timeline (
                                        id SERIAL PRIMARY KEY,
                                        event_date DATE,
                                        title VARCHAR(200),
    description TEXT
    );
