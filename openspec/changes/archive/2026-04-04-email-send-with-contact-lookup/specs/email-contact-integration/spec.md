## ADDED Requirements

### Requirement: Email con integración de contactos
El sistema SHALL verificar la existencia del contacto antes de enviar el email, SHALL crear un nuevo contacto si no existe, y SHALL registrar el mensaje enviado en la tabla de messages.

#### Scenario: Contacto existente
- **WHEN** se envía un email a un destinatario que ya existe en la tabla contacts
- **THEN** el sistema usa el contactId existente y registra el message con referencia a ese contacto

#### Scenario: Contacto nuevo
- **WHEN** se envía un email a un destinatario que NO existe en la tabla contacts
- **THEN** el sistema crea un nuevo contacto con el email como nombre y stage="new", luego registra el message

#### Scenario: Envío de email exitoso
- **WHEN** el email se envía exitosamente via SMTP
- **THEN** el sistema registra en la tabla messages: canal=email, dirección=saliente, leido=true, entregado=true

#### Scenario: Envío de email fallido
- **WHEN** el envío de email falla por error de SMTP
- **THEN** el sistema retorna error con código 500 y no crea registros en la DB

#### Scenario: Error en transacción
- **WHEN** falla cualquier paso (contacto o message) dentro de la transacción
- **THEN** se hace rollback de todos los cambios y se retorna error