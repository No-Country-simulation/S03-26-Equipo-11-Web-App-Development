# Plan de Implementación - Backend CRM

## 1. Visión General del Proyecto

Este documento establece el plan para implementar el backend del proyecto CRM utilizando **Java Spring Boot** con **arquitectura hexagonal** (Ports & Adapters) y **PostgreSQL** como base de datos.

### Tecnologías a Utilizar

| Componente | Tecnología |
|------------|-------------|
| Framework | Spring Boot 3.x |
| Lenguaje | Java 17+ |
| Base de datos | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Documentación | SpringDoc OpenAPI (Swagger) |
| Seguridad | Spring Security + JWT |
| testing | JUnit 5, MockMvc, Testcontainers |

---

## 2. Arquitectura Hexagonal

### Estructura de Paquetes

```
com.crm/
├── domain/                    # Nucleo de negocio (sin dependencias externas)
│   ├── model/                 # Entidades del dominio
│   ├── repository/            # Interfaces de repositorio (ports)
│   ├── service/               # Servicios de dominio
│   └── port/                  # Puertos (interfaces)
├── application/               # Casos de uso / Servicios de aplicación
│   ├── dto/                   # Data Transfer Objects
│   ├── mapper/                # Mapeadores entre entidades y DTOs
│   └── usecase/               # Casos de uso
├── infrastructure/           # Adaptadores externos
│   ├── persistence/          # Implementaciones JPA
│   │   ├── repository/       # Repositorios concretos
│   │   ├── entity/           # Entidades JPA
│   │   └── mapper/           # Mapeadores JPA
│   ├── api/                   # Controladores REST
│   │   ├── controller/       # Controllers
│   │   ├── dto/              # DTOs de request/response
│   │   └── config/           # Configuración de seguridad
│   └── external/              # Adaptadores externos (WhatsApp, SMTP)
└── config/                    # Configuración global
```

### Flujo de Datos

```
Request HTTP → Controller → UseCase → Domain Service → Repository (Interface)
                                                        ↓
                                              Infrastructure (JPA Implementation)
```

---

## 3. Modelo de Datos

### Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| **Contact** | Contactos/leads del CRM |
| **Reminder** | Recordatorios asociados a contactos |
| **Notification** | Notificaciones de recordatorios |
| **Template** | Plantillas de email |
| **NotificationMethod** | Métodos de notificación (EMAIL, WHATSAPP) |
| **Usuario** | Usuario del sistema |
| **Etiqueta** | Etiquetas para categorizar contactos |
| **WhatsAppMessage** | Mensajes de WhatsApp |
| **EmailMessage** | Mensajes de email |

### Esquema SQL

El esquema existente se encuentra en: `docs/base de datos/diagram_db.sql`

---

## 4. Plan de Implementación por Fases

### Fase 1: Configuración del Proyecto (Semana 1)

#### 1.1 Crear Proyecto Spring Boot

- Generar proyecto con Spring Initializr
- Dependencias: Web, Data JPA, Security, Validation, PostgreSQL, Lombok

#### 1.2 Configurar PostgreSQL

- docker-compose.yml con PostgreSQL
- Configuración de conexión en application.yml

#### 1.3 Estructura Base

- Crear paquete raíz `com.crm`
- Configurar logging básico

#### Entregables
- Proyecto base funcionando
- Conexión a PostgreSQL exitosa
- Logging configurado

---

### Fase 2: Infraestructura y Seguridad (Semana 1-2)

#### 2.1 Entidades JPA

- Mapear entidades del dominio a tablas PostgreSQL
- Configurar relaciones entre entidades

#### 2.2 Repositorios

- Crear interfaces Repository en domain
- Implementar en infrastructure/persistence

#### 2.3 Seguridad JWT

- Implementar AuthenticationProvider
- Configurar JWT Filter
- Endpoints de login/register

#### 2.4 Documentación API

- Configurar SpringDoc OpenAPI
- Documentar endpoints de autenticación

#### Entregables
- Entidades persistidas en PostgreSQL
- Autenticación JWT funcionando
- Swagger UI accesible en /swagger-ui.html

---

### Fase 3: Gestión de Contactos (Semana 2-3)

#### 3.1 CRUD Contactos

- GET /api/contacts (listar con filtros)
- POST /api/contacts (crear)
- GET /api/contacts/{id} (obtener)
- PUT /api/contacts/{id} (actualizar)
- PATCH /api/contacts/{id}/state (cambiar estado)
- DELETE /api/contacts/{id} (soft delete)

#### 3.2 Búsqueda y Filtrado

- Implementar Specifications JPA para filtros
- Búsqueda por nombre, empresa, estado

#### 3.3 Exportación

- GET /api/contacts/export (CSV)

#### Entregables
- CRUD completo de contactos
- Filtros funcionales
- Exportación CSV operativa

---

### Fase 4: Gestión de Plantillas de Email (Semana 3)

#### 4.1 CRUD Plantillas

- GET /api/templates
- POST /api/templates
- PUT /api/templates/{id}
- DELETE /api/templates/{id}

#### Entregables
- CRUD de plantillas operativo

---

### Fase 5: Mensajería Email (Semana 3-4)

#### 5.1 Envío de Emails

- POST /api/email/send (enviar con plantilla)
- Integración con servidor SMTP

#### 5.2 Bandeja de Entrada

- GET /api/email/inbox
- GET /api/email/threads/{contact_id}

#### 5.3 Métricas

- GET /api/email/metrics

#### Entregables
- Envío de emails funcional
- Bandeja de entrada operativa

---

### Fase 6: Mensajería WhatsApp (Semana 4-5)

#### 6.1 Webhook Entrante

- POST /api/webhooks/whatsapp
- Validación de firma Meta

#### 6.2 Envío de Mensajes

- POST /api/whatsapp/messages

#### 6.3 Conversaciones

- GET /api/whatsapp/conversations/{contact_id}

#### 6.4 Métricas

- GET /api/whatsapp/metrics/total
- GET /api/whatsapp/metrics/weekly

#### Entregables
- Webhook WhatsApp operativo
- Envío/recepción de mensajes
- Métricas básicas

---

### Fase 7: Recordatorios (Semana 5-6)

#### 7.1 CRUD Recordatorios

- POST /api/reminders
- GET /api/reminders
- PUT /api/reminders/{id}
- DELETE /api/reminders/{id}

#### 7.2 Sistema de Notificaciones

- Scheduler para revisar recordatorios
- Envío automático de notificaciones
- Registro de notificaciones enviadas

#### Entregables
- CRUD de recordatorios
- Notificaciones automáticas

---

### Fase 8: Métricas y Analítica (Semana 6)

#### 8.1 KPIs

- GET /api/analytics/kpis
- GET /api/analytics/funnel

#### 8.2 Gráficos

- GET /api/analytics/activity

#### 8.3 Reportes

- GET /api/analytics/report (PDF)

#### Entregables
- Dashboard de métricas completo

---

### Fase 9: Configuración (Semana 6)

#### 9.1 Configuración del Sistema

- GET /api/config
- PUT /api/config

#### Entregables
- Panel de configuración operativo

---

## 5. Endpoints API

La documentación completa de endpoints se encuentra en: `docs/backend_service.md`

---

## 6. Configuración de Archivos

### application.yml (Desarrollo)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crm_db
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

app:
  jwt:
    secret: your-secret-key
    expiration: 86400000
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: crm_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 7. Convenciones de Código

### Nombres

- **Entidades**: PascalCase (Contact, Reminder)
- **Tablas**: snake_case (contact, reminder)
- **Campos**: snake_case
- **Métodos**: camelCase
- **DTOs**: [Entidad]Request, [Entidad]Response

### Paquetes

- Lowercase para paquetes
- Singular para entidades (no plurales)

### Testing

- Pruebas unitarias para domain services
- Pruebas de integración para repositories
- Pruebas end-to-end para controllers

---

## 8. Dependencias Maven

```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 9. Orden de Implementación Recomendado

1. **Infraestructura base** → Proyecto, PostgreSQL, seguridad
2. **Contacto** → CRUD completo (entidad principal)
3. **Plantillas** → CRUD básico
4. **Email** → Envío, bandeja de entrada
5. **WhatsApp** → Webhook, envío, recepción
6. **Recordatorios** → CRUD + scheduler
7. **Métricas** → KPIs, gráficos, reportes
8. **Configuración** → Panel de settings

---

## 10. Referencias

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [SpringDoc OpenAPI](https://springdoc.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
