## 1. Session Panel UX

- [x] 1.1 Revisar el bloque actual de usuario en `app/(crm)/layout.tsx` y definir el trigger del panel de cuenta
- [x] 1.2 Disenar la estructura visual del panel con nombre, email, rol y accion de logout
- [x] 1.3 Definir estados de carga, fallback de identidad y cierre del panel por clic externo o `Escape`

## 2. Frontend Behavior

- [x] 2.1 Adaptar el layout CRM para abrir y cerrar el panel reutilizando la sesion ya cargada
- [x] 2.2 Integrar la accion de logout dentro del panel evitando multiples envios simultaneos
- [x] 2.3 Garantizar accesibilidad de teclado y foco para trigger, panel y accion de logout

## 3. Validation

- [x] 3.1 Verificar que el panel muestra correctamente nombre, email y rol con sesion valida
- [x] 3.2 Verificar que logout limpia la vista local y redirige a `/login`
- [x] 3.3 Validar que la navegacion protegida siga redirigiendo a `/login` cuando no exista sesion
