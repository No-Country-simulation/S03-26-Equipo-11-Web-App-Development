# WAHA - WhatsApp HTTP API (Self-Hosted)

## Estado Actual: ✅ CONFIGURADO Y VINCULADO

- **Puerto**: 4000 (desarrollo)
- **Estado de sesión**: WORKING
- **Usuario WhatsApp**: Favian (+59167023053)
- **Engine**: WEBJS v2.3000.1036930770
- **Versión**: WAHA Core (gratis)

---

## 🚀 Pasos para Levantar WAHA

### Prerrequisitos
- Docker Desktop instalado y corriendo
- Puerto 4000 disponible

### 1. Navegar al directorio
```powershell
cd D:\nc\002\waha
```

### 2. Iniciar contenedor
```powershell
docker compose up -d
```

### 3. Verificar que está corriendo
```powershell
docker ps
```

### 4. Acceder al Dashboard
- **URL**: http://localhost:4000/dashboard
- **Usuario**: admin
- **Contraseña**: 2aa3a2ee6ec4422c8299651f23831a54

---

## 📋 Endpoints Funcionales

| # | Endpoint | Método | Descripción |
|---|----------|--------|-------------|
| 1 | `/api/sessions` | GET | Listar todas las sesiones |
| 2 | `/api/sessions/{session}` | GET | Estado de sesión específica |
| 3 | `/api/sessions/{session}/start` | POST | Iniciar sesión |
| 4 | `/api/sessions/{session}/restart` | POST | Reiniciar sesión |
| 5 | `/api/{session}/auth/qr` | GET | Obtener QR para vincular |
| 6 | `/api/sendText` | POST | Enviar mensaje de texto |
| 7 | `/api/{session}/chats/overview` | GET | Resumen de chats (ligero) |
| 8 | `/api/{session}/chats` | GET | Lista completa de chats |

---

## 🔧 Comandos para Probar Endpoints

### Listar sesiones
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/sessions" -Headers @{"x-api-key"="0148d3609e824423acf609c15f2b42b8"}
```

### Ver estado de sesión
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/sessions/default" -Headers @{"x-api-key"="0148d3609e824423acf609c15f2b42b8"}
```

### Obtener QR
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/default/auth/qr" -Headers @{"x-api-key"="0148d3609e824423acf609c15f2b42b8"; "Accept"="application/json"}
```

### Reiniciar sesión
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/sessions/default/restart" -Method POST -Headers @{"x-api-key"="0148d3609e824423acf609c15f2b42b8"}
```

### Enviar mensaje (requiere chatId格式: phone@c.us)
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/sendText" -Method POST -Headers @{"x-api-key"="0148d3609e824423acf609c15f2b42b8"; "Content-Type"="application/json"} -Body '{"session":"default","chatId":"59167023053@c.us","text":"Hola desde WAHA!"}'
```

### Obtener resumen de chats (recomendado)
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/default/chats/overview?limit=20" -Headers @{"x-api-key"="0148d3609e824423acf609c15f2b42b8"}
```

### Obtener lista de chats
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/default/chats" -Headers @{"x-api-key"="0148d3609e824423acf609c15f2b42b8"}
```

---

## 📁 Archivos de Tests

- **Archivo principal**: `D:\nc\002\waha\docs\tests\waha_w.http`
- Usa extensión "REST Client" en VS Code

---

## ⚠️ Limitaciones de WAHA Core

- ❌ Obtener mensajes de un chat específico (error 500)
- ❌ Obtener contactos
- ❌ Marcar mensajes como leídos
- ✅ Solo funcionan: sesiones, envío, overview de chats

---

## 📁 Estructura de Archivos

```
D:\nc\002\waha\
├── docker-compose.yaml
├── .env
├── sessions/
├── media/
├── README.md
└── docs\tests\waha_w.http
```

---

## 🔑 Credenciales

| Variable | Valor |
|----------|-------|
| WAHA_API_KEY | 0148d3609e824423acf609c15f2b42b8 |
| DASHBOARD_USER | admin |
| DASHBOARD_PASS | 2aa3a2ee6ec4422c8299651f23831a54 |

---

## 📖 Recursos

- Docs: https://waha.devlike.pro/docs/
- GitHub: https://github.com/devlikeapro/waha

---

## 🚀 Deploy a la Nube (Pendiente - Para Testing/Demo)

### Opciones para Testing/Demo

| Plataforma | Costo Estimado | Notas |
|------------|----------------|-------|
| Railway | ~$5-10/mes | Template готов: https://railway.com/deploy/waha |
| Render | ~$5-10/mes | Requiere Persistent Disk |

### Pasos para Deploy en Railway

1. Crear cuenta en Railway (es gratis para comenzar)
2. Ir a: https://railway.com/deploy/waha
3. Configurar variables de entorno:
   - `WAHA_DASHBOARD_PASSWORD`
   - (API Key se genera automáticamente)
4. Deploy automático desde Docker
5. Vincular WhatsApp desde el dashboard online

### Notas Importantes

- ✅ WAHA Core funciona en la nube
- ⚠️ Requiere acceso a web.whatsapp.com (verificar que el hosting permita acceso)
- ⚠️ Persistencia: Las sesiones se guardan en disco, configurar volumen si es necesario
- 📝 Para producción considerar WAHA Plus (~15$/mes) por mayor estabilidad

### URLs de Referencia

- Railway template: https://railway.com/deploy/waha
- Docs WAHA: https://waha.devlike.pro/docs/