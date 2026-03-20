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