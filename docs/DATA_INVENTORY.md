# Inventario de datos personales

Actualizado: 2026-07-31. Los períodos de retención fueron confirmados por el propietario. La protección efectiva en reposo y la automatización de los borrados deben verificarse en los proveedores.

| Dato | Fuente / punto de recogida | Finalidad | Almacenamiento | Acceso / terceros | Retención / eliminación | Obligatorio | Meta | Logs | Tránsito / reposo |
|---|---|---|---|---|---|---|---|---|---|
| Nombre | Club Xela `/api/rewards/enroll`, registro, encuesta | Identificar y atender cliente | Google Sheets `clientes`, encuestas; memoria local legacy | Personal admin; Google | Mientras la cuenta esté activa; borrar o anonimizar máximo 30 días tras solicitud validada | Club: sí; encuesta: no | No | Puede aparecer en auditoría operativa | HTTPS producción / protección del proveedor pendiente de verificación |
| Teléfono/WhatsApp | Club, saldo, compras | Cuenta, saldo y contacto | Sheets `clientes`, `rewards`; memoria legacy | Admin, ventas; Google | Cuenta activa; máximo 30 días tras solicitud, salvo transacciones retenidas | Sí para Club | No | Últimos 4 dígitos en algunos logs; URL legacy completa | HTTPS / protección del proveedor pendiente |
| Correo | Club y encuesta | Contacto opcional | Sheets | Admin; Google | Cuenta activa o 24 meses si forma parte de encuesta | No | No | No observado intencionalmente | HTTPS / protección del proveedor pendiente |
| Ciudad y tipo de cliente | Club | Estadísticas, promociones, planificación de sucursales y adaptación de atención | Sheets `clientes` | Admin; Google | Mientras la cuenta esté activa; máximo 30 días tras solicitud validada | Sí en UI | No | No observado | HTTPS / protección del proveedor pendiente |
| Fecha de nacimiento histórica | Versiones anteriores de Club | Sin finalidad vigente | Puede existir históricamente en `clientes`; ya no se solicita ni se guarda | Admin; Google | Eliminar o anonimizar; máximo 30 días tras solicitud validada | No; recolección desactivada | No | No observado | HTTPS / protección del proveedor pendiente |
| Encuesta y comentario | `/api/encuesta` | Mejora del servicio | Google Sheets | Personal autorizado; Google | 24 meses | Calificaciones/consentimiento según UI | No | Errores podrían contener detalles antes de redacción completa | HTTPS / protección del proveedor pendiente |
| Pregunta/respuesta chat web | `/preguntar` | Responder y mantener memoria comercial | Google Sheets memoria | Operadores; Google | 24 meses | Sí al usar chat | No | Errores y metadatos | HTTPS / protección del proveedor pendiente |
| ID Meta y mensaje Messenger | `POST /webhook` | Responder conversación | Google Sheets memoria; Meta | Operadores, Google y Meta | 24 meses; borrar/anonimizar máximo 30 días tras verificación | Necesario al usar Messenger | Sí | Payload completo retirado; sólo fallos de envío seguros | HTTPS + firma HMAC / protección del proveedor pendiente |
| Compra, factura, puntos, saldo | Admin/ventas | Programa de recompensas y auditoría | Sheets `rewards`, `Audit_Log` | Admin, ventas; Google | 7 años; anonimizar identificadores cuando proceda sin comprometer obligación de auditoría | Sí para transacción | No | IDs internos/factura pueden aparecer en auditoría | HTTPS / protección del proveedor pendiente |
| Empleado/admin, rol y hashes | Login/configuración | Seguridad y autorización | Sheets y variables de entorno | Administradores; Google/hosting | Vida de la cuenta; logs asociados según plazo aplicable | Sí | No | ID y resultado de login, nunca contraseña/hash | HTTPS / hash scrypt; reposo según proveedor |
| IP, user-agent, correlation ID | Rate limit/auditoría | Seguridad y diagnóstico | Memoria de proceso, logs, `Audit_Log` | Operadores, hosting, Google | Logs técnicos 90 días; errores del servidor 180 días | Automático | No | Sí | HTTPS / protección del proveedor pendiente |
| Solicitud de eliminación | `/api/data-deletion/requests` | Verificar y ejecutar derechos | `Data_Deletion_Requests` | Privacidad/admin; Google | Constancia mínima; plazo definitivo de auditoría pendiente de definición | Sí para solicitar | Puede identificar cuenta Meta | Sólo error/correlation ID | HTTPS / protección del proveedor pendiente |

## Minimización pendiente

- La fecha de nacimiento dejó de solicitarse y guardarse. Deben limpiarse los valores históricos.
- Ciudad y tipo de cliente se conservan para estadísticas, promociones, planificación de sucursales y adaptación de la atención.
- Migrar por completo el saldo desde `/api/saldo/<telefono>` al POST ya existente; el endpoint legacy se conserva por compatibilidad.
- No solicitar permisos adicionales de Meta. Confirmar en Dashboard qué permisos están activos.
- Prohibir en operación el registro de tokens, cookies, credenciales, cuerpos de webhook y conversaciones completas.
- Configurar borrado automático conforme a estos plazos; la documentación por sí sola no ejecuta la retención.

## Backups confirmados

- Base de datos y archivos importantes: backup diario.
- Código: versionado en GitHub.
- Backups diarios: 30 días; semanales: 3 meses; mensuales: 12 meses.
- Eliminación automática al vencer.
- Ante eliminación de usuario: borrar del backup cuando sea técnicamente posible o impedir su restauración al entorno operativo hasta que expire.
