-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         PostgreSQL 17.6 on x86_64-windows, compiled by msvc-19.44.35213, 64-bit
-- SO del servidor:              
-- HeidiSQL Versión:             12.16.0.7229
-- --------------------------------------------------------

 CREATE DATABASE startupcrm_db
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_ES.UTF-8'
  LC_CTYPE = 'es_ES.UTF-8'
  TEMPLATE = template0;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



-- Volcando estructura para tabla public.contact
CREATE TABLE IF NOT EXISTS "contact" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"name" VARCHAR(150) NOT NULL,
	"email" VARCHAR(255) NOT NULL,
	"phone" VARCHAR(30) NOT NULL,
	"phone_prefix" VARCHAR(5) NOT NULL,
	"enterprise" VARCHAR(255) NOT NULL,
	"state" VARCHAR(50) NOT NULL,
	"last_contact" DATE NOT NULL,
	"deleted_at" BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY ("id")
)
CREATE INDEX "idx_contact_deleted_at" ON "" ("deleted_at");
CREATE INDEX "idx_contact_email" ON "" ("email");
CREATE INDEX "idx_contact_enterprise" ON "" ("enterprise");;

-- Volcando datos para la tabla public.contact: 6 rows
INSERT INTO "contact" ("id", "name", "email", "phone", "phone_prefix", "enterprise", "state", "last_contact", "deleted_at") VALUES
	('11111111-1111-1111-1111-111111111111', 'Ana Perez', 'ana.perez@example.com', '76543210', '+591', '1001', 'Contactado', '2026-03-25', 'false'),
	('22222222-2222-2222-2222-222222222222', 'Carlos Gomez', 'carlos.gomez@example.com', '71234567', '+591', '1001', 'PENDING', '2026-03-18', 'false'),
	('33333333-3333-3333-3333-333333333333', 'Lucia Rojas', 'lucia.rojas@example.com', '79887766', '+54', '2002', 'INACTIVE', '2026-03-10', 'true'),
	('4487528b-b00e-472f-b367-60707119b11e', 'Juana Peraz', 'juana@example.net', '7234567', '+591', '1', 'Lead', '2026-03-25', 'false'),
	('7aeb95a2-19e9-4f5a-b4a0-175af8df22fa', 'Tester user', 'tester@example.com', '123456', '+1', '1', 'Lead', '2026-03-25', 'false'),
	('869c79c6-870b-4856-ab77-d6fb8b5b602e', 'Juanito Pérezito', 'juan@example.com', '555123456', '+34', '1', 'Lead', '2026-03-25', 'true');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;


CREATE TABLE "reminder"(
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "id_contact" BIGINT NOT NULL,
    "prioridad" VARCHAR(255) CHECK
        ("prioridad" IN('')) NOT NULL,
        "date" DATE NOT NULL,
        "time" TIME(0) WITHOUT TIME ZONE NOT NULL,
        "done" BOOLEAN NOT NULL
);
ALTER TABLE
    "reminder" ADD PRIMARY KEY("id");
CREATE TABLE "notification"(
    "id" UUID NOT NULL,
    "id_notification_method" UUID NOT NULL,
    "id_reminder" UUID NOT NULL,
    "id_contact" UUID NOT NULL,
    "anticipation" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "notification" ADD PRIMARY KEY("id");
CREATE TABLE "contact"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "phone_prefix" VARCHAR(5) NOT NULL,
    "enterprise" BIGINT NOT NULL,
    "state" VARCHAR(255) CHECK
        ("state" IN('')) NOT NULL,
        "last_contact" DATE NOT NULL,
        "deleted_at" BOOLEAN NOT NULL
);
ALTER TABLE
    "contact" ADD PRIMARY KEY("id");
CREATE TABLE "template"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "asunto" VARCHAR(255) NOT NULL,
    "cuerpo_html" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "template" ADD PRIMARY KEY("id");
CREATE TABLE "notification_method"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL
);
ALTER TABLE
    "notification_method" ADD PRIMARY KEY("id");
CREATE TABLE "usuario"(
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "whatsapp_number" VARCHAR(255) NOT NULL,
    "email_smtp" VARCHAR(255) NOT NULL,
    "password" bytea NOT NULL,
    "enterprise" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "usuario" ADD PRIMARY KEY("id");
CREATE TABLE "etiqueta"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "etiqueta" ADD PRIMARY KEY("id");
CREATE TABLE "email_send"("id" BIGINT NOT NULL);
ALTER TABLE
    "email_send" ADD PRIMARY KEY("id");
ALTER TABLE
    "notification" ADD CONSTRAINT "notification_id_notification_method_foreign" FOREIGN KEY("id_notification_method") REFERENCES "notification_method"("id");
ALTER TABLE
    "notification" ADD CONSTRAINT "notification_id_reminder_foreign" FOREIGN KEY("id_reminder") REFERENCES "reminder"("id");
ALTER TABLE
    "notification" ADD CONSTRAINT "notification_id_contact_foreign" FOREIGN KEY("id_contact") REFERENCES "contact"("id");