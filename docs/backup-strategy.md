# Estrategia de Backup: Seguridad de Datos

Este documento describe cómo realizar copias de seguridad de la información del CRM (Contactos y Mensajes).

## 1. Base de Datos Local (SQLite)
El archivo se encuentra en `data/crm.db`. Para respaldarlo manualmente:
1.  Detén el servidor de desarrollo.
2.  Copia el archivo a una ubicación segura o un servicio de almacenamiento en la nube.

## 2. Base de Datos de Producción (Turso)
Turso gestiona backups automáticos, pero para realizar una exportación manual puedes usar la **Turso CLI**:

### Exportar esquema y datos a SQL:
```bash
turso db shell <nombre-de-tu-db> .dump > backup_produccion.sql
```

### Crear una réplica local para pruebas:
```bash
turso db download <nombre-de-tu-db> -o backup_local.db
```

## 3. Contactos (CSV/PDF)
El CRM incluye una función de exportación incorporada:
1.  Ve a la sección **Contactos**.
2.  Haz clic en el botón de **Exportar**.
3.  Selecciona el formato deseado para obtener una copia legible de tu base de clientes actual.

---
**Frecuencia recomendada:** Semanal para bases de datos activas.
