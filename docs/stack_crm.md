## 🚀 STACK PROYECTO

### **Frontend** (React + Vite)

| Tecnología                      | Uso                                   | Estado |
| ------------------------------- | ------------------------------------- | ------ |
| **React 18** + **TypeScript**   | Core de la interfaz                   | ✅     |
| **Vite**                        | Build tool ultrarrápido               | ✅     |
| **TailwindCSS** + **shadcn/ui** | UI moderna y componentes accesibles   | ✅     |
| **TanStack Query**              | Manejo de estado y caché del servidor | ✅     |
| **React Router DOM v6**         | Navegación                            | ✅     |
| **Recharts**                    | Gráficos y métricas                   | ✅     |
| **React Hook Form** + **Zod**   | Formularios y validación tipada       | ✅     |
| **Lucide React**                | Iconos                                | ✅     |

---

### **Backend** (Java + Spring Boot)

| Tecnología                    | Uso                                   | Estado |
| ----------------------------- | ------------------------------------- | ------ |
| **Java 17** (LTS)             | Lenguaje base                         | ⏳     |
| **Spring Boot 3.2.x**         | Framework principal                   | ⏳     |
| **Spring Web (MVC)**          | API REST + WebSocket                  | ⏳     |
| **Spring Security** + **JWT** | Autenticación y autorización          | ⏳     |
| **Spring Data JPA**           | ORM                                   | ⏳     |
| **PostgreSQL**                | Base de datos relacional              | ⏳     |
| **Flyway**                    | Migraciones controladas de BD         | ⏳     |
| **MapStruct**                 | Mapeo DTO/Entidad                     | ⏳     |
| **Lombok**                    | Reducción de boilerplate              | ⏳     |
| **OpenAPI 3 (Swagger)**       | Documentación automática de endpoints | ⏳     |

---

### **Base de Datos**

| Tecnología               | Uso                                        |
| ------------------------ | ------------------------------------------ |
| **PostgreSQL**           | Base de datos relacional                   |
| **Supabase** (evaluando) | PostgreSQL + Auth + Realtime (alternativa) |

---

### **Infraestructura y Despliegue**

| Tecnología                      | Uso                             |
| ------------------------------- | ------------------------------- |
| **Docker** + **Docker Compose** | Entorno local unificado         |
| **Vercel / Render**             | Hosting para backend y frontend |

---

### **Arquitectura**

```text
┌─────────────────┐     REST API + WS    ┌─────────────────┐
│   Frontend      │◄──────────────────►│   Backend Java  │
│   (React)       │    (Spring Boot)   │   (Spring Boot) │
└─────────────────┘                    └────────┬────────┘
                                              │
                                        PostgreSQL
                                              │
┌─────────────────┐                    ┌────────▼────────┐
│   Cliente       │◄──────────────────►│   WhatsApp      │
│   (Landing)     │     REST API       │   Cloud API     │
└─────────────────┘                    └─────────────────┘
```

---

### **API Externa**

- **WhatsApp Cloud API** (Meta) - Mensajería
- **API SMTP** - Envío de emails
