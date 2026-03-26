# CRM Backend - Spring Boot

Backend del sistema CRM para startups, desarrollado con Java 17 y Spring Boot 3.2.4, siguiendo una Arquitectura Hexagonal.

---

## 🚀 Requisitos Previos

-   **Java 17+** (o **Docker Desktop** para contenedores)
-   **PostgreSQL** instalado y corriendo en puerto 5432
-   **Maven 3.8+** (incluido en el proyecto via `mvnw`)

---

## 📋 Configuración de PostgreSQL

### 1. Asegurarse de que PostgreSQL esté corriendo

Verifica que el servicio de PostgreSQL esté activo en tu sistema.

### 2. Crear la base de datos `startupcrm_db`

En tu cliente SQL (ej. pgAdmin, psql):

```sql
CREATE DATABASE startupcrm_db;
```

### 3. Verificar Credenciales en `application.yml`

Edita `src/main/resources/application.yml` y asegúrate de que las credenciales coincidan con tu configuración de PostgreSQL.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/startupcrm_db
    username: postgres
    password: 1 # <-- CAMBIA ESTO por tu contraseña real
```

---

## 🔧 Ejecución del Backend

### Opción 1: Ejecución Local (Recomendado para Desarrollo)

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Ejecuta la aplicación usando el Maven Wrapper:
    ```bash
    .\mvnw spring-boot:run
    ```
    (Si tienes Maven instalado globalmente, puedes usar `mvn spring-boot:run`)

### Opción 2: Ejecución con Docker Compose

Este método levanta la aplicación Spring Boot en un contenedor Docker, asumiendo que PostgreSQL sigue corriendo localmente.

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Ejecuta Docker Compose (usando el perfil `app`):
    ```bash
    docker-compose --profile app up --build
    ```
    Esto construirá la imagen del backend y levantará el contenedor, mapeando el puerto `8080:8080`.

### Verificación

La aplicación se iniciará en **http://localhost:8080**.

-   **Swagger UI**: `http://localhost:8080/swagger-ui.html`
-   **API**: `http://localhost:8080/api/contacts`

---

## ✅ Implementación Completada

Este backend gestiona los contactos del CRM, soportando operaciones CRUD y filtrado, con un enfoque en la arquitectura hexagonal.

### Issues Corregidos

-   Versión de Spring Boot corregida a 3.2.4.
-   `ContactRepository.findById()` ahora retorna `Optional<Contact>` para un manejo más robusto de nulos.
-   Configuración para PostgreSQL local y credenciales actualizadas.

### Funcionalidades de Contactos

**Endpoints implementados:**

| Método | Endpoint                   | Descripción                                  |
| :----- | :------------------------- | :------------------------------------------- |
| `GET`  | `/api/contacts`            | Listar contactos (con filtros `q` y `state`) |
| `GET`  | `/api/contacts/{id}`       | Obtener contacto por ID                      |
| `POST` | `/api/contacts`            | Crear nuevo contacto                         |
| `PUT`  | `/api/contacts/{id}`       | Actualizar contacto                          |
| `PATCH`| `/api/contacts/{id}/state` | Cambiar estado del contacto                  |
| `DELETE`| `/api/contacts/{id}`       | Eliminar contacto (soft delete)              |
| `GET`  | `/api/contacts/export`     | Exportar contactos a CSV                     |

**Casos de Uso Implementados:**

-   `CreateContact` - Crear contacto con validación de email único.
-   `GetAllContacts` - Listar contactos con filtros de búsqueda y estado.
-   `GetContactById` - Obtener contacto por ID.
-   `UpdateContact` - Actualizar datos de un contacto.
-   `UpdateContactState` - Cambiar el estado de un contacto con validación.
-   `DeleteContact` - Realiza un borrado lógico (soft delete) marcando el campo `deleted_at`.
-   `ExportContactsCsv` - Exporta la lista de contactos a un archivo CSV.

---

## 📚 Documentación API

Una vez que la aplicación esté corriendo, puedes acceder a:

-   **Swagger UI**: `http://localhost:8080/swagger-ui.html`
-   **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## 🧪 Pruebas Rápidas

Puedes usar `curl` o la interfaz de Swagger UI para probar los endpoints:

### Test 1: Crear Contacto

```bash
curl -X POST http://localhost:8080/api/contacts 
  -H "Content-Type: application/json" 
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "555123456",
    "phonePrefix": "+34",
    "enterprise": "Tech Corp"
  }'
```

### Test 2: Listar Contactos

```bash
curl http://localhost:8080/api/contacts
# Debería retornar una lista JSON de contactos (vacía o con el contacto creado)
```

### Test 3: Filtrar Contactos (por estado)

```bash
curl "http://localhost:8080/api/contacts?state=Lead"
# Debería retornar contactos con estado 'Lead'
```

### Test 4: Exportar a CSV

```bash
curl http://localhost:8080/api/contacts/export -o contacts.csv
# Descargará un archivo llamado 'contacts.csv'
```

---

## 🗂️ Estructura del Proyecto

El proyecto sigue una **Arquitectura Hexagonal (Ports and Adapters)** para separar la lógica de negocio del dominio de los detalles de infraestructura.

```
src/
├── main/
│   ├── java/com/crm/
│   │   ├── domain/              # 🔵 NÚCLEO: Lógica de negocio y entidades
│   │   │   ├── model/           # Entidades de dominio (ej. Contact.java)
│   │   │   └── port/            # Interfaces de repositorio (puertos)
│   │   ├── application/         # 🟢 APLICACIÓN: Casos de uso y DTOs
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   └── usecase/         # Lógica de negocio orquestada
│   │   └── infrastructure/      # 🔴 INFRAESTRUCTURA: Adaptadores
│   │       ├── adapter/         # Implementaciones JPA de repositorios (adaptadores)
│   │       ├── controller/      # Controladores REST (adaptadores de entrada)
│   │       ├── config/          # Configuraciones (Seguridad, OpenAPI, Beans)
│   │       ├── mapper/          # Mapeadores entre DTOs/Entities y modelos de dominio
│   │       └── exception/       # Manejo global de excepciones
│   │   └── CrmBackendApplication.java
│   └── resources/
│       └── application.yml      # Configuración de Spring Boot
└── test/
    └── java/com/crm/            # Tests unitarios e integración
```

Para una descripción más detallada de la arquitectura, consulta el archivo:
[Arquitectura Hexagonal](docs/arquitectura-hexagonal.md)

---

## 🛠️ Stack Tecnológico

| Tecnología        | Versión     | Propósito                     |
| :---------------- | :---------- | :---------------------------- |
| Java              | 17          | Lenguaje de programación (LTS) |
| Spring Boot       | 3.2.4       | Framework para microservicios |
| Spring Data JPA   | -           | ORM para interacción con BD   |
| PostgreSQL        | -           | Base de datos relacional      |
| Spring Security   | -           | Seguridad y autenticación     |
| SpringDoc OpenAPI | 2.3.0       | Documentación automática de API |
| Lombok            | -           | Reducción de boilerplate     |
| Maven             | 3.8+ (mvnw) | Herramienta de construcción   |

---

## 📝 Notas Importantes

-   **Soft Delete**: Los contactos no se eliminan físicamente; el campo `deleted_at` se marca a `true`.
-   **Estados Válidos**: `Lead`, `Contactado`, `Propuesta`, `Cliente`, `Inactivo`.
-   **Email Único**: No se permiten emails duplicados para contactos activos.
-   **Timezone**: La aplicación opera en UTC por defecto.
-   **Hibernate**: Configurado para `ddl-auto: update`, lo que crea/actualiza tablas automáticamente.

---

## 🔐 Seguridad (Notas para Producción)

Actualmente, todos los endpoints están abiertos para facilitar el desarrollo. Para un entorno de producción:

-   Implementar autenticación JWT completa.
-   Configurar HTTPS.
-   Cambiar la clave secreta JWT en `application.yml` (`app.jwt.secret`).

---

## 💡 Solución de Problemas Comunes

### Puerto 8080 ya está en uso

1.  **Encontrar el proceso:**
    ```bash
    netstat -ano | findstr :8080
    ```
2.  **Terminar el proceso:** (Reemplaza `<PID>` con el ID encontrado)
    ```bash
    taskkill /PID <PID> /F
    ```
3.  **Alternativa:** Cambia el puerto en `application.yml` (ej. `server.port: 8081`).

### Error de conexión a PostgreSQL

-   Verifica que PostgreSQL esté corriendo.
-   Asegúrate de que la base de datos `startupcrm_db` exista.
-   Verifica que el `username` y `password` en `application.yml` sean correctos.

### Error: Docker no está corriendo

-   Asegúrate de que Docker Desktop esté iniciado.
-   Verifica el estado con `docker ps`.

---

## 🚀 Próximos Pasos (Módulos Pendientes)

Los siguientes módulos están identificados para futuras implementaciones:

1.  **Plantillas de Email** - Gestión de templates.
2.  **Envío de Emails** - Integración con servicios SMTP.
3.  **WhatsApp** - Webhooks y envío de mensajes.
4.  **Recordatorios** - Gestión de recordatorios con scheduler.
5.  **Métricas/Analytics** - Paneles con KPIs y reportes.
6.  **Configuración** - Panel de ajustes.
