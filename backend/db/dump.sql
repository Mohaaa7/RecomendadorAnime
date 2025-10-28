CREATE DATABASE IF NOT EXISTS `recomendador-anime`;
USE `recomendador-anime`;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos usuarios de prueba
INSERT INTO usuarios (nombre, contrasena, email) VALUES 
('usuario1', '123456', 'usuario1@email.com'),
('admin', 'admin123', 'admin@email.com');