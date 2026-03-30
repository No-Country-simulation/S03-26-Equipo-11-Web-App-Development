-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         PostgreSQL 17.6 on x86_64-windows, compiled by msvc-19.44.35213, 64-bit
-- HeidiSQL Versión:             12.16.0.7229
-- --------------------------------------------------------

 CREATE DATABASE startupcrm_db
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_ES.UTF-8'
  LC_CTYPE = 'es_ES.UTF-8'
  TEMPLATE = template0;


CREATE TABLE "reminder"(
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "id_contact" UUID NOT NULL,
    "prioridad" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME(0) WITHOUT TIME ZONE NOT NULL,
    "done" BOOLEAN NOT NULL,
    CONSTRAINT ck_reminder_prioridad CHECK ("prioridad" IN('BAJA', 'MEDIA', 'ALTA'))
);
ALTER TABLE "reminder" ADD PRIMARY KEY("id");

CREATE TABLE "notification_method"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL
);
ALTER TABLE "notification_method" ADD PRIMARY KEY("id");

CREATE TABLE "contact"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "phone_prefix" VARCHAR(5) NOT NULL,
    "enterprise" BIGINT NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "last_contact" DATE NOT NULL,
    "deleted_at" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT ck_contact_state CHECK ("state" IN('NUEVO', 'CONTACTADO', 'CLIENTE', 'INACTIVO'))
);
ALTER TABLE "contact" ADD PRIMARY KEY("id");

CREATE TABLE "template"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "asunto" VARCHAR(255) NOT NULL,
    "cuerpo_html" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE "template" ADD PRIMARY KEY("id");

CREATE TABLE "notification"(
    "id" UUID NOT NULL,
    "id_notification_method" UUID NOT NULL,
    "id_reminder" UUID NOT NULL,
    "id_contact" UUID NOT NULL,
    "anticipation" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE "notification" ADD PRIMARY KEY("id");

CREATE TABLE "usuario"(
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "whatsapp_number" VARCHAR(255) NOT NULL,
    "email_smtp" VARCHAR(255) NOT NULL,
    "password" bytea NOT NULL,
    "enterprise" VARCHAR(255) NOT NULL
);
ALTER TABLE "usuario" ADD PRIMARY KEY("id");

CREATE TABLE "etiqueta"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE "etiqueta" ADD PRIMARY KEY("id");

CREATE TABLE "email_send"(
    "id" BIGINT NOT NULL,
    "id_contact" UUID NOT NULL,
    "id_template" UUID NOT NULL,
    "sent_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "status" VARCHAR(50) NOT NULL
);
ALTER TABLE "email_send" ADD PRIMARY KEY("id");

ALTER TABLE "notification" ADD CONSTRAINT "notification_id_notification_method_foreign" 
    FOREIGN KEY("id_notification_method") REFERENCES "notification_method"("id");

ALTER TABLE "notification" ADD CONSTRAINT "notification_id_reminder_foreign" 
    FOREIGN KEY("id_reminder") REFERENCES "reminder"("id");

ALTER TABLE "notification" ADD CONSTRAINT "notification_id_contact_foreign" 
    FOREIGN KEY("id_contact") REFERENCES "contact"("id");

INSERT INTO "notification_method" ("id", "name", "active") VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'EMAIL', TRUE),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'WHATSAPP', TRUE),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'SMS', FALSE);

INSERT INTO "contact" ("id", "name", "email", "phone", "phone_prefix", "enterprise", "state", "last_contact", "deleted_at") VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Ana Perez', 'ana.perez@example.com', '76543210', '+591', 1001, 'CONTACTADO', '2026-03-25', 'false'),
    ('22222222-2222-2222-2222-222222222222', 'Carlos Gomez', 'carlos.gomez@example.com', '71234567', '+591', 1001, 'CONTACTADO', '2026-03-18', 'false'),
    ('33333333-3333-3333-3333-333333333333', 'Lucia Rojas', 'lucia.rojas@example.com', '79887766', '+54', 2002, 'INACTIVO', '2026-03-10', 'true'),
    ('4487528b-b00e-472f-b367-60707119b11e', 'Juana Peraz', 'juana@example.net', '7234567', '+591', 1, 'NUEVO', '2026-03-25', 'false'),
    ('7aeb95a2-19e9-4f5a-b4a0-175af8df22fa', 'Tester user', 'tester@example.com', '123456', '+1', 1, 'NUEVO', '2026-03-25', 'false'),
    ('869c79c6-870b-4856-ab77-d6fb8b5b602e', 'Juanito Pérezito', 'juan@example.com', '555123456', '+34', 1, 'NUEVO', '2026-03-25', 'true'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Juan Perez', 'juan.perez@empresa1.com', '1234567890', '+54', 1, 'CLIENTE', '2026-03-15', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Maria Garcia', 'maria.garcia@empresa2.com', '9876543210', '+54', 2, 'CONTACTADO', '2026-03-20', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Carlos Lopez', 'carlos.lopez@empresa3.com', '4561237890', '+54', 1, 'NUEVO', '2026-03-22', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Ana Rodriguez', 'ana.rodriguez@empresa4.com', '7891234560', '+54', 3, 'CLIENTE', '2026-03-10', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Pedro Martinez', 'pedro.martinez@empresa5.com', '3216549870', '+54', 2, 'INACTIVO', '2025-12-05', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Laura Sanchez', 'laura.sanchez@empresa6.com', '6549871230', '+54', 1, 'CONTACTADO', '2026-03-18', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Miguel Torres', 'miguel.torres@empresa7.com', '1472583690', '+54', 3, 'NUEVO', '2026-03-23', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Sofia Hernandez', 'sofia.hernandez@empresa8.com', '2583691470', '+54', 2, 'CLIENTE', '2026-03-12', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'Diego Ramirez', 'diego.ramirez@empresa9.com', '3691472580', '+54', 1, 'CONTACTADO', '2026-03-19', FALSE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'Carmen Diaz', 'carmen.diaz@empresa10.com', '9517534860', '+54', 3, 'NUEVO', '2026-03-21', FALSE);

INSERT INTO "reminder" ("id", "title", "description", "id_contact", "prioridad", "date", "time", "done") VALUES 
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Llamada de seguimiento', 'Contactar para propuesta comercial', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ALTA', '2026-03-25', '10:00:00', FALSE),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Enviar presupuesto', 'Enviar presupuesto detallado', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'MEDIA', '2026-03-26', '14:30:00', FALSE),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Recordatorio renovación', 'Renovación de contrato', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'BAJA', '2026-04-01', '09:00:00', FALSE);

INSERT INTO "template" ("id", "name", "asunto", "cuerpo_html", "created_at", "updated_at") VALUES 
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Bienvenida', 'Bienvenido a nuestro servicio', '<html><body><h1>Hola {{nombre}}</h1><p>Bienvenido a nuestro servicio</p></body></html>', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Seguimiento', 'Seguimiento de tu solicitud', '<html><body><h1>Hola {{nombre}}</h1><p>Te contactamos para dar seguimiento a tu solicitud</p></body></html>', '2026-01-01 00:00:00', '2026-01-01 00:00:00');
