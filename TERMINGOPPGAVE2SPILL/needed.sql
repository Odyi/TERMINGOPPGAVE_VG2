CREATE DATABASE IF NOT EXISTS game_platform;
USE game_platform;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cookie_clicker_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    score INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reaction_test_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reaction_time FLOAT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
