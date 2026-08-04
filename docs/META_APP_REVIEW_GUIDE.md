# Guía para Meta App Review

Actualizado: 2026-07-31. Estado: no enviar hasta completar todos los placeholders.

## Aplicación y URLs

- Nombre: Perfiles y Metales Xela / Bobby (confirmar nombre exacto en Dashboard).
- Propósito: responder preguntas comerciales recibidas mediante Messenger y dirigir a clientes hacia información de productos y contacto.
- Producción: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/`
- Privacidad: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/privacy.html`
- Términos: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/terms.html`
- Eliminación: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/data-deletion.html`
- Contacto: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/contact.html`
- Credencial de prueba: `[META_REVIEW_TEST_USER]` / `[SECURELY_SHARED_TEST_CREDENTIAL]` sólo si el flujo la requiere.

## Flujo del revisor

1. Abrir `[META_PAGE_OR_TEST_ENTRY_URL]`.
2. Enviar “¿Qué perfiles tienen disponibles?”.
3. Comprobar que Bobby responde con información comercial y no pide permisos adicionales.
4. Enviar un mensaje fuera de alcance y comprobar que ofrece contacto por WhatsApp.
5. Abrir la URL de privacidad y la de eliminación sin iniciar sesión.
6. Enviar una solicitud de eliminación de prueba y conservar el código de confirmación.
7. El operador verifica identidad, actualiza el estado y documenta la eliminación real antes de marcar COMPLETED.

Si el usuario rechaza o revoca el acceso de la página a Messenger, la experiencia de mensajería no funciona; el sitio y WhatsApp siguen disponibles. La revocación se realiza desde la configuración de Facebook/Meta del usuario y, si aplica, desde `[APP_DEAUTHORIZE_URL]`.

## Permisos

El repositorio no contiene el Dashboard y no demuestra el conjunto final de permisos. No solicitar ningún permiso sin evidencia funcional.

| Permiso | Función que lo necesita | Evidencia en código | Beneficio directo | Datos recibidos | Retención | Eliminación | Video |
|---|---|---|---|---|---|---|---|
| `[CONFIRM_MESSENGER_PERMISSION]` | Recibir/responder mensajes de una Página | `POST /webhook`, llamada `/me/messages` | Respuesta automatizada a consulta iniciada por usuario | PSID, texto, message ID | 24 meses | Solicitud pública; máximo 30 días tras verificación | Sí |

Todo permiso distinto al confirmado arriba debe marcarse innecesario y retirarse manualmente del Dashboard si no alimenta una función real.

## Grabaciones requeridas

- Video 1: abrir la Página, iniciar conversación, mostrar pregunta y respuesta, sin cortes que oculten la interacción.
- Video 2: mostrar la función exacta que justifica cada permiso aprobado.
- Video 3: abrir `/data-deletion`, enviar solicitud de prueba, mostrar código y consulta de estado.
- Video 4: mostrar revocación/desconexión si el producto configurado la requiere.

No mostrar secretos, tokens, datos de clientes reales ni paneles con información personal.

## No está lista si

- Persisten otros placeholders legales u operativos visibles.
- `META_APP_SECRET`, `VERIFY_TOKEN` o `PAGE_ACCESS_TOKEN` no están configurados/rotados.
- Las URLs no están públicas bajo HTTPS o no coinciden con Dashboard.
- No existe procedimiento operativo para verificar identidad y borrar en todas las hojas/backups.
- No se confirmaron permisos, webhooks suscritos, Business Verification, App Domains, icono y categoría.
