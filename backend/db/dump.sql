CREATE DATABASE IF NOT EXISTS `recomendador-anime`;
USE `recomendador-anime`;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos usuarios de prueba
INSERT INTO usuarios (nombre, contrasena, email, rol) VALUES 
('usuario1', '123456', 'usuario1@email.com', 'usuario'),
('admin', 'admin123', 'admin@email.com', 'admin'),
('otaku', 'naruto123', 'otaku@email.com', 'usuario'),
('moderador', 'mod2025', 'moderador@email.com', 'admin');