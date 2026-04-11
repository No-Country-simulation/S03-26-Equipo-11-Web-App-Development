## Context

El layout CRM actual ya resuelve autenticación básica: consulta sesión al montar, redirige a `/login` si no existe usuario y expone `handleSignOut` contra `/api/auth/signout`. Sin embargo, el bloque inferior del sidebar mezcla identidad y acción en una pieza estática pequeña, sin un patrón claro de panel de cuenta. El cambio necesita mejorar legibilidad, descubribilidad del logout y consistencia visual sin alterar el backend de autenticación.

## Goals / Non-Goals

**Goals:**
- Convertir el bloque actual de usuario en un disparador de panel de cuenta.
- Mostrar nombre, email y rol del usuario en un contenedor claro y accesible.
- Mantener logout como acción explícita dentro del panel.
- Reutilizar el flujo actual de sesión y cierre de sesión ya implementado.
- Definir comportamiento de interacción, foco, estados de carga y redirección.

**Non-Goals:**
- No cambiar endpoints auth ni lógica Better Auth.
- No agregar edición de perfil, avatar remoto, cambio de contraseña o preferencias.
- No mover la lógica de sesión fuera del layout CRM.

## Decisions

### Usar un panel desplegable liviano anclado al bloque de usuario
Se propone evolucionar el bloque inferior del sidebar a un trigger tipo dropdown/popover en vez de una página separada. Esto reduce fricción para logout y mantiene contexto de navegación.

Alternativas consideradas:
- Página de perfil separada: más pesada para una acción frecuente.
- Mantener botón aislado: menor claridad y peor capacidad de expansión futura.

### Reutilizar la sesión ya cargada en `app/(crm)/layout.tsx`
El layout ya obtiene `name`, `email` y `role` desde `GET /api/auth/get-session`. El panel debe consumir ese mismo estado local para evitar una segunda lectura.

Alternativas consideradas:
- Reconsultar sesión al abrir el panel: agrega latencia y complejidad sin valor.

### Mantener logout como acción directa y redirección forzada a `/login`
El panel debe invocar el mismo flujo actual de logout, limpiar estado local y redirigir al usuario. No se requiere confirmación modal en esta propuesta para no añadir fricción innecesaria.

Alternativas consideradas:
- Confirmación extra de logout: útil en algunos sistemas, pero excesiva para este caso.

### Diseñar para accesibilidad y expansión futura
El panel debe soportar apertura/cierre por mouse y teclado, focus management y cierre al perder foco o seleccionar una acción. La estructura debe dejar espacio para acciones futuras sin reescribir el patrón.

Alternativas consideradas:
- Implementación ad hoc sin patrón accesible: más rápida, pero propensa a regresiones de UX.

## Risks / Trade-offs

- [El panel agrega complejidad visual en sidebar] → Mantener contenido mínimo: solo identidad y logout.
- [Posibles inconsistencias si la sesión cambia durante la navegación] → Reusar sesión local y mantener la validación inicial del layout.
- [Problemas de foco o cierre accidental] → Definir interacciones de accesibilidad desde la especificación.
- [Dependencia del layout actual] → Limitar el cambio al bloque de cuenta y no al resto de navegación.

## Migration Plan

- No requiere migración de datos ni backend.
- Implementación incremental en frontend dentro del layout CRM.
- Rollback simple: restaurar el bloque estático actual de usuario y logout.

## Open Questions

- Si el trigger debe abrirse con clic sobre todo el bloque o solo sobre el avatar.
- Si conviene mostrar una etiqueta más legible del rol (`Administrador`, `Usuario`) en vez del valor crudo.
- Si el panel debe incluir enlaces futuros como “Mi cuenta” o solo logout en esta primera versión.
