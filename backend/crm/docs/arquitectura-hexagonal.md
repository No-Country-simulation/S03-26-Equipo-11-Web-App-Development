# Arquitectura Hexagonal - CRM Backend

## ¿Qué es la Arquitectura Hexagonal?

La Arquitectura Hexagonal (también conocida como Ports and Adapters o Arquitectura de Puertos y Adaptadores) es un patrón de diseño que busca crear aplicaciones **libres de dependencias externas**, permitiendo que el núcleo de la lógica de negocio sea independiente de frameworks, bases de datos y interfaces de usuario.

### Principios Fundamentales

1. **Separación de Responsabilidades**: La lógica de negocio está aislada del mundo exterior
2. **Inversión de Dependencias**: Las dependencias apuntan hacia el núcleo, nunca al revés
3. **Puertos y Adaptadores**: Los puertos definen interfaces, los adaptadores las implementan

### Beneficios

- **Testabilidad**: La lógica de negocio se puede probar sin dependencias externas
- **Mantenibilidad**: Cambios en infraestructura no afectan el dominio
- **Flexibilidad**: Puedes cambiar de base de datos o framework sin reescribir lógica
- **Reusabilidad**: El núcleo es independiente y reusable

---

```mermaid
graph TB
    subgraph "Capa de Presentación (Infrastructure)"
        Controller[ContactController<br/>REST API]
        Security[SecurityConfig<br/>CORS & Security]
    end

    subgraph "Capa de Aplicación (Application)"
        UseCase[GetAllContacts<br/>Caso de Uso]
    end

    subgraph "Capa de Dominio (Domain)"
        Model[Contact<br/>Entidad]
        Port[ContactRepository<br/>Puerto]
    end

    subgraph "Infrastructure"
        Adapter[ContactAdapter<br/>Adaptador JPA]
        Entity[ContactEntity<br/>Entidad JPA]
        Mapper[ContactMapper<br/>Mapper]
        DB[(PostgreSQL<br/>Base de Datos)]
    end

    Controller --> UseCase
    UseCase --> Port
    Port --> Adapter
    Adapter --> Entity
    Entity --> DB
    Mapper -.-> Entity
    Security -.-> Controller

    style Controller fill:#ff6b6b,stroke:#333,stroke-width:2px
    style UseCase fill:#4ecdc4,stroke:#333,stroke-width:2px
    style Model fill:#ffe66d,stroke:#333,stroke-width:2px
    style Port fill:#95e1d3,stroke:#333,stroke-width:2px
    style Adapter fill:#a8e6cf,stroke:#333,stroke-width:2px
    style Entity fill:#dcedc1,stroke:#333,stroke-width:2px
    style Mapper fill:#ffd3b6,stroke:#333,stroke-width:2px
    style DB fill:#c9c9c9,stroke:#333,stroke-width:2px
```

---

## Arquitectura del Proyecto

### Estructura de Capas

```
src/main/java/com/crm/
├── domain/                    # 🔵 NÚCLEO (Dominio)
│   ├── model/               # Entidades del negocio
│   │   └── Contact.java
│   └── port/                # Interfaces/Puertos
│       └── ContactRepository.java
│
├── application/              # 🟢 Aplicación (Casos de Uso)
│   └── usecase/
│       └── GetAllContacts.java
│
└── infrastructure/           # 🔴 Infraestructura (Adaptadores)
    ├── adapter/
    │   ├── ContactEntity.java      # Entidad JPA
    │   └── ContactAdapter.java     # Implementación del repositorio
    ├── mapper/
    │   └── ContactMapper.java      # Mapper Domain <-> Entity
    ├── controller/
    │   └── ContactController.java # Endpoints REST
    └── config/
        ├── SecurityConfig.java    # Seguridad
        └── CorsConfig.java         # CORS
```

### Flujo de Datos

```mermaid
sequenceDiagram
    participant Client as Cliente (Frontend)
    participant Controller as ContactController
    participant UseCase as GetAllContacts
    participant Port as ContactRepository
    participant Adapter as ContactAdapter
    participant JPA as Hibernate/JPA
    participant DB as PostgreSQL

    Client->>Controller: GET /api/contacts
    Controller->>UseCase: execute()
    UseCase->>Port: findAll()
    Port->>Adapter: findAll()
    Adapter->>JPA: SELECT * FROM contact
    JPA->>DB: Query SQL
    DB-->>JPA: Resultados
    JPA-->>Adapter: ContactEntity[]
    Adapter-->>Port: Contact[]
    Port-->>UseCase: Contact[]
    UseCase-->>Controller: Contact[]
    Controller-->>Client: 200 OK (JSON)
```

---

## Tecnología y Ambiente

### Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Backend | Spring Boot 4.0.4 + Java 17 |
| Base de Datos | PostgreSQL 15 |
| Seguridad | Spring Security + JWT |
| API Docs | SpringDoc OpenAPI |
| Build | Maven |

### Docker

El proyecto utiliza Docker para levantar la base de datos PostgreSQL.

```yaml
# docker-compose.yml
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
```

### Configuración de Conexión

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crm_db
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update  # Auto-crea las tablas
```

### Puertos

| Servicio | Puerto |
|----------|--------|
| Backend (Spring Boot) | 8080 |
| PostgreSQL | 5432 |
| Frontend (Vite) | 5173 |

---

## Descripción de Componentes

### Domain (Núcleo)
- **Contact**: Entidad del dominio que representa un contacto del CRM
- **ContactRepository**: Puerto (interfaz) que define las operaciones de persistencia

### Application
- **GetAllContacts**: Caso de uso que implementa la lógica de negocio para obtener todos los contactos

### Infrastructure
- **ContactController**: Controlador REST que expone los endpoints de la API
- **ContactAdapter**: Adaptador que implementa el puerto usando JPA
- **ContactEntity**: Entidad JPA para el mapeo con la base de datos
- **ContactMapper**: Mapper para convertir entre dominio e infraestructura

---

## Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/contacts` | Obtiene todos los contactos |
| GET | `/api/contacts/{id}` | Obtiene un contacto por ID |
| POST | `/api/contacts` | Crea un nuevo contacto |
| PUT | `/api/contacts/{id}` | Actualiza un contacto |
| DELETE | `/api/contacts/{id}` | Elimina un contacto (soft delete) |

### Documentación API

Swagger disponible en: `http://localhost:8080/swagger-ui/index.html`
