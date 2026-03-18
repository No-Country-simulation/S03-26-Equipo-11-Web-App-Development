-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'agente', 'supervisor') DEFAULT 'agente',
    avatar_url VARCHAR(255),
    ultimo_acceso TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_activo (activo)
);

-- Tabla de contactos
CREATE TABLE contactos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    empresa VARCHAR(100),
    cargo VARCHAR(100),
    tipo_usuario ENUM('lead', 'cliente_activo', 'cliente_inactivo', 'prospecto') DEFAULT 'lead',
    estado_funnel VARCHAR(50),
    fuente VARCHAR(50),
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_contacto TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_telefono (telefono),
    INDEX idx_tipo_usuario (tipo_usuario),
    INDEX idx_estado_funnel (estado_funnel)
);

-- Tabla de etiquetas
CREATE TABLE etiquetas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#3498db',
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
);

-- Relación contactos-etiquetas
CREATE TABLE contacto_etiqueta (
    contacto_id INT,
    etiqueta_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contacto_id, etiqueta_id),
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE
);

-- Tabla de etapas del funnel
CREATE TABLE funnel_etapas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    orden INT NOT NULL,
    color VARCHAR(7) DEFAULT '#3498db',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_orden (orden)
);

-- Tabla de conversaciones
CREATE TABLE conversaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT NOT NULL,
    canal ENUM('whatsapp', 'email', 'sms', 'otros') NOT NULL,
    estado ENUM('activa', 'archivada', 'pendiente') DEFAULT 'activa',
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_mensaje TIMESTAMP,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
    INDEX idx_contacto (contacto_id),
    INDEX idx_estado (estado)
);

-- Tabla de mensajes
CREATE TABLE mensajes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversacion_id INT NOT NULL,
    contenido TEXT NOT NULL,
    tipo ENUM('texto', 'imagen', 'audio', 'video', 'documento') DEFAULT 'texto',
    direccion ENUM('enviado', 'recibido') NOT NULL,
    leido BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE,
    INDEX idx_conversacion (conversacion_id),
    INDEX idx_fecha (fecha_envio)
);

-- Tabla de plantillas de email
CREATE TABLE plantillas_email (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    cuerpo_html TEXT,
    cuerpo_texto TEXT,
    variables JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
);

-- Tabla de emails
CREATE TABLE emails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT NOT NULL,
    plantilla_id INT,
    asunto VARCHAR(200) NOT NULL,
    cuerpo TEXT NOT NULL,
    estado ENUM('borrador', 'programado', 'enviado', 'fallido') DEFAULT 'borrador',
    fecha_programacion TIMESTAMP NULL,
    fecha_envio TIMESTAMP NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
    FOREIGN KEY (plantilla_id) REFERENCES plantillas_email(id) ON DELETE SET NULL,
    INDEX idx_contacto (contacto_id),
    INDEX idx_estado (estado)
);

-- Tabla de tareas
CREATE TABLE tareas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    estado ENUM('pendiente', 'en_progreso', 'completada', 'cancelada') DEFAULT 'pendiente',
    fecha_limite TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_limite (fecha_limite)
);

-- Tabla de recordatorios
CREATE TABLE recordatorios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tarea_id INT,
    contacto_id INT,
    fecha_recordatorio TIMESTAMP NOT NULL,
    tipo ENUM('email', 'whatsapp', 'push', 'sms') DEFAULT 'push',
    mensaje TEXT,
    enviado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
    INDEX idx_fecha (fecha_recordatorio),
    INDEX idx_enviado (enviado)
);

-- Tabla de métricas diarias
CREATE TABLE metricas_diarias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    contactos_nuevos INT DEFAULT 0,
    contactos_activos INT DEFAULT 0,
    mensajes_enviados INT DEFAULT 0,
    mensajes_recibidos INT DEFAULT 0,
    emails_enviados INT DEFAULT 0,
    emails_abiertos INT DEFAULT 0,
    conversaciones_nuevas INT DEFAULT 0,
    tareas_completadas INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_fecha (fecha),
    INDEX idx_fecha (fecha)
);

-- Tabla de vistas guardadas
CREATE TABLE vistas_guardadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    modulo ENUM('contactos', 'conversaciones', 'tareas', 'reportes') NOT NULL,
    filtros JSON NOT NULL,
    columnas JSON,
    predeterminada BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    UNIQUE KEY unique_usuario_nombre (usuario_id, nombre)
);

-- Tabla de historial de contactos (auditoría)
CREATE TABLE contacto_historial (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contacto_id INT NOT NULL,
    usuario_id INT,
    accion VARCHAR(50) NOT NULL,
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_contacto (contacto_id),
    INDEX idx_fecha (created_at)
);