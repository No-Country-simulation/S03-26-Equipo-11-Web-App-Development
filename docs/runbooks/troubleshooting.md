# Runbook: Troubleshooting

Solucion a problemas comunes en Startup CRM.

---

## Problemas de Build

### Error: Module not found

```
Module not found: Can't resolve '@/components/ui/button'
```

**Solucion:**
```bash
# Verificar que el path existe
ls components/ui/button.tsx

# Si falta, crear el componente
# Ver docs/architecture/11_components.md
```

### Error: TypeScript errors

```
Type 'string' is not assignable to type 'number'
```

**Solucion:**
```bash
# Ejecutar TypeScript checker
npx tsc --noEmit

# Ver errores especificos
# Corregir en el archivo mencionado
```

### Error: Tailwind CSS not loading

**Solucion:**
```bash
# Verificar postcss.config.mjs
cat postcss.config.mjs

# Limpiar cache
rm -rf .next node_modules/.cache

# Reiniciar dev server
npm run dev
```

---

## Problemas de API

### Error 500 en /api/email/send

```
Internal Server Error
```

**Diagnostico:**
```bash
# Ver logs en Vercel
vercel logs tu-proyecto --since=60m | grep "email/send"

# Probar localmente con curl
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"to":"test@test.com","subject":"Test"}'
```

**Solucion:**
1. Verificar credenciales SMTP en variables de entorno
2. Verificar que Gmail tenga 2FA y contrasena de aplicacion
3. Revisar logs para error especifico

### Error: Invalid JSON

```
SyntaxError: Unexpected token
```

**Solucion:**
```bash
# Verificar que el body es JSON valido
# Usar formato correcto:
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d "{\"to\":\"test@test.com\",\"subject\":\"Test\"}"
```

### Error: Cannot connect to IMAP

```
Error: Authentication failed
```

**Solucion:**
1. Verificar credenciales IMAP
2. Verificar que IMAP esta habilitado en Gmail:
   - myaccount.google.com > Seguridad > IMAP
3. Usar contrasena de aplicacion, no contrasena normal

---

## Problemas de Variables de Entorno

### Variables no cargan en produccion

**Sintoma:** Valores incorrectos o indefinidos

**Solucion:**
```bash
# 1. Ir a Vercel Dashboard
# 2. Project > Settings > Environment Variables

# 3. Verificar:
# - Nombres exactos (case-sensitive)
# - Ambiente correcto (Production)
# - Sin espacios extra

# 4. Si hay cambios, hacer redeploy
vercel --prod
```

### Variables .env.local no funcionan

**Sintoma:** Servidor no reconoce variables

**Solucion:**
```bash
# 1. Verificar que el archivo existe
ls -la .env.local

# 2. Verificar contenido
cat .env.local

# 3. Reiniciar dev server
npm run dev
```

---

## Problemas de Rendimiento

### Pagina carga lenta

**Diagnostico:**
1. Ver Network tab en DevTools
2. Verificar Vercel Analytics

**Soluciones:**
```bash
# 1. Build con optimizacion
npm run build

# 2. Limpiar cache de Next.js
rm -rf .next

# 3. Verificar imagenes optimizadas
# Usar next/image para todas las imagenes
```

### Memory leak en dev server

**Solucion:**
```bash
# Reiniciar dev server
# Ctrl+C para detener
npm run dev
```

---

## Problemas de Base de Datos (Futuro)

### Error de conexion SQLite

```
Error: ENOENT: no such file or directory
```

**Solucion:**
```bash
# Verificar que existe la carpeta data
ls -la data/

# Si no existe, crear
mkdir -p data

# Verificar permisos
chmod 755 data/
```

### Error de migracion Drizzle

```
Error: relation "contacts" does not exist
```

**Solucion:**
```bash
# Generar migraciones
npx drizzle-kit generate

# Aplicar migraciones
npx drizzle-kit push
```

---

## Problemas de WhatsApp (Futuro)

### Webhook no recibe mensajes

**Diagnostico:**
1. Verificar URL del webhook en Meta Developer Console
2. Verificar que la URL es accesible publicamente
3. Verificar token de verificacion

**Solucion:**
```bash
# Testear webhook manualmente
curl -X GET https://tu-dominio.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=TOKEN&hub.challenge=CHALLENGE
```

---

## Problemas de Autenticacion (Futuro)

### NextAuth no funciona

**Sintoma:** Redirect loop o 401

**Solucion:**
1. Verificar NEXTAUTH_SECRET
2. Verificar NEXTAUTH_URL
3. Verificar provider credentials

---

## Checklist de Troubleshooting

```
[ ] Reiniciar dev server
[ ] Limpiar cache (rm -rf .next)
[ ] Verificar variables de entorno
[ ] Ver logs de Vercel
[ ] Verificar Node.js version
[ ] Reinstalar dependencias (rm -rf node_modules && npm install)
```

---

## Contacto de Soporte

| Nivel | Cuando contactar |
|-------|-----------------|
| **P1** | Sistema no disponible, todos los usuarios afectados |
| **P2** | Funcionalidad principal no funciona |
| **P3** | Problema menor, work-around disponible |
| **P4** | Mejoras, optimizaciones |

**Canal:** GitHub Issues o Discord del equipo

---

## Links Utiles

- [Vercel Logs](https://vercel.com/docs/concepts/deployments/inspecting-deployments)
- [Next.js Troubleshooting](https://nextjs.org/docs/pages/building-your-application/configuring/error-handling)
- [Drizzle ORM Docs](https://orm.drizzle.team)

---

**Anterior**: [Environment Setup](environment-setup.md)  
**Siguiente**: [Mantenimiento](maintenance.md)

**Volver a**: [Runbooks Index](README.md)
