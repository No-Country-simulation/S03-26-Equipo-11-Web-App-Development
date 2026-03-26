-- Script de inicialización de base de datos para CRM Backend
-- Ejecutar en PostgreSQL

-- Crear base de datos (si no existe)
-- CREATE DATABASE startup_crm;

-- Conectarse a la base de datos startup_crm antes de ejecutar el resto

-- Tabla contact (ajustada para Hibernate)
CREATE TABLE IF NOT EXISTS contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    phone_prefix VARCHAR(5) NOT NULL,
    enterprise VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Lead',
    last_contact DATE NOT NULL,
    deleted_at BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact(email) WHERE deleted_at = FALSE;
CREATE INDEX IF NOT EXISTS idx_contact_state ON contact(state) WHERE deleted_at = FALSE;
CREATE INDEX IF NOT EXISTS idx_contact_name ON contact(name) WHERE deleted_at = FALSE;
CREATE INDEX IF NOT EXISTS idx_contact_enterprise ON contact(enterprise) WHERE deleted_at = FALSE;

-- Comentario
COMMENT ON TABLE contact IS 'Contactos/Leads del CRM con soft delete';
COMMENT ON COLUMN contact.state IS 'Estados válidos: Lead, Contactado, Propuesta, Cliente, Inactivo';
