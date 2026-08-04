# Auditoría técnica inicial para Meta

Fecha de auditoría: 2026-07-31  
Alcance: frontend `Perfiles-y-Metales-Xela` y backend hermano `Perfiles-y-Metales-Xela-backend`  
Estado: diagnóstico inicial previo a cambios funcionales

Actualización del propietario: se confirmó **Perfiles y Metales Xela** como nombre legal y **rocketclub90@gmail.com** como correo de privacidad. La tabla siguiente conserva el estado observado durante la auditoría inicial.

## Resumen del sistema observado

- Frontend estático en HTML, CSS y JavaScript, servido desde GitHub Pages y/o Flask/Render.
- Backend Flask con Flask-CORS, Flask-Limiter, sesiones firmadas y Google Sheets como almacenamiento operativo.
- Autenticación separada para administradores y empleados; hashes gestionados con Werkzeug (scrypt en versiones actuales), sesiones de servidor firmadas en cookie y validación CSRF en mutaciones administrativas.
- Integración real con Meta Messenger mediante `/webhook` y Graph API.
- Datos personales: nombre, teléfono/WhatsApp, correo opcional, ciudad, tipo de cliente, fecha de nacimiento opcional, respuestas de encuesta, mensajes de Messenger, identificador de remitente de Meta e historial de recompensas/compras.
- Terceros observados: Meta Graph API/Messenger, Google Sheets/Google service account, Google Fonts, WhatsApp links, Google Maps, Render y GitHub Pages.
- No se observó Facebook Login, Instagram, Meta Pixel, pagos, analítica, cookies publicitarias ni almacenamiento web del lado del cliente.

## Línea base

- `python -m unittest discover -s tests -v`: 23/23 pruebas aprobadas.
- No existe manifiesto de frontend, linter, type checker ni build reproducible.
- `requirements.txt` no fija versiones ni existe lockfile.
- Flask-Limiter advierte que usa almacenamiento en memoria, no recomendado para producción.
- El frontend tenía cambios no rastreados preexistentes bajo `admin/`; se preservarán.

## Matriz de cumplimiento

| Requisito | Estado actual | Evidencia encontrada | Riesgo | Cambio mínimo recomendado | Archivo afectado | Estado |
|---|---|---|---|---|---|---|
| Política de privacidad pública | No existe ruta ni página | No hay `/privacy` ni documento equivalente | App Review incompleta y falta de transparencia | Agregar página pública fiel al inventario y enlace en footer | frontend; `main.py` | FAIL |
| Términos públicos | No existen | No hay `/terms` | App Review incompleta | Agregar página con placeholders legales explícitos | frontend; `main.py` | FAIL |
| Instrucciones de eliminación | No existen | No hay `/data-deletion` | Incumplimiento de requisitos de plataforma | Agregar página y mecanismo funcional | frontend; backend | FAIL |
| Contacto público | Existe WhatsApp y datos comerciales | Enlaces `wa.me` y datos en `Data/empresa_info.py`; posteriormente se confirmó `rocketclub90@gmail.com` | Faltaba un canal específico de privacidad durante el diagnóstico inicial | Correo de privacidad confirmado y agregado | frontend | PASS |
| Inventario de datos y retención | No documentado | Campos repartidos en formularios, Flask y Google Sheets | Tratamiento opaco y retención indefinida | Crear inventario; usar placeholders para plazos | `docs/DATA_INVENTORY.md` | FAIL |
| Minimización de datos | Fecha de nacimiento retirada tras decisión del propietario; ciudad y tipo conservados con finalidad declarada | Formulario y payload nuevos ya no incluyen `fecha_nacimiento` | Valores históricos pueden permanecer | Limpiar valores históricos y automatizar retención | frontend/backend/docs | PARTIAL |
| Facebook Login/OAuth | No se usa | Sin SDK, redirect OAuth ni scopes de Facebook Login | Ninguno para esta revisión | No implementar ni declarar | N/A | NOT_APPLICABLE |
| Messenger webhook verification | Verifica challenge | `GET /webhook` compara `hub.verify_token` | Token predeterminado conocido si falta configuración | Exigir `VERIFY_TOKEN` en producción y comparar de forma segura | `main.py` | PARTIAL |
| Firma de webhook Meta | No se valida | `POST /webhook` procesa JSON sin `X-Hub-Signature-256` | Eventos falsificados, abuso y filtración | Validar HMAC-SHA256 sobre raw body antes de parsear | `main.py` | FAIL |
| Idempotencia de webhook | No existe | Cada evento se procesa al recibirlo | Mensajes/respuestas duplicados | Dedupe acotado por message ID | `main.py` | FAIL |
| Privacidad de logs de Meta | Se imprimen payload y respuesta completos | `print(data)` y `print(r.text)` | Filtración de IDs, mensajes y tokens indirectos | Registrar sólo metadatos seguros | `main.py` | FAIL |
| Token de acceso de Meta | Backend env, pero también aparece en query string saliente | `PAGE_ACCESS_TOKEN`; URL `...?access_token=` | Exposición en trazas/proxies | Enviar token en `Authorization: Bearer`; añadir timeout | `main.py` | PARTIAL |
| Scopes/permisos de Meta | No declarados en código | Sólo envío Messenger Graph API | Solicitud excesiva no verificable desde repo | Documentar permisos reales mediante placeholder y confirmar en Dashboard | docs | PARTIAL |
| Data Deletion Callback de Meta | No existe | Sin callback y sin Facebook Login | Puede ser requerido por la configuración del producto Messenger/app | Implementar sólo tras confirmar requisito/producto y APP_SECRET; mientras, URL pública de eliminación | backend/docs | PARTIAL |
| Solicitud general de eliminación | No existe | Sin modelo/endpoint | Usuarios no pueden ejercer eliminación | Endpoint no enumerativo, seguimiento opaco, estados y verificación posterior | backend/frontend | FAIL |
| Eliminación en Google Sheets/backups | No implementada | No hay operación cross-sheet de borrado/anonimización | Solicitudes no ejecutables automáticamente | Implementar cola auditable y procedimiento; confirmar política de backup | backend/docs | FAIL |
| Hashing de credenciales | Hash mantenido de Werkzeug | `generate_password_hash`/`check_password_hash` | Adecuado; PIN corto sigue siendo susceptible a fuerza bruta | Mantener hashing y rate limit; revisar longitud de PIN | admin/sales | PASS |
| Cookies de sesión | HttpOnly; Secure en producción; SameSite None en producción | `app.config.update(...)` | `SameSite=None` amplía superficie CSRF; falta nombre/prefijo y rotación documentada | Usar `Lax` cuando el despliegue same-site lo permita; conservar CSRF | `main.py` | PARTIAL |
| CSRF | Administración sí; ventas parcialmente basado en sesión | Pruebas admin; mutaciones sales no exigen token CSRF | CSRF posible si cookies cross-site | Añadir CSRF compatible a mutaciones o cerrar cookies a SameSite Lax | `sales_point.py`, frontend ventas | PARTIAL |
| Autorización y roles | Backend aplica decoradores y roles | `admin_required`, `roles_required`, `sales_required`; pruebas | Cobertura no exhaustiva | Ampliar pruebas de endpoints sensibles | backend/tests | PASS |
| Prevención de enumeración | Respuestas revelan existencia | saldo, registro y rewards distinguen cliente existente/no existente | Descubrimiento de clientes por teléfono | Respuesta genérica o verificación de identidad; no romper flujo sin diseño | `main.py` | FAIL |
| Datos personales en URL | Teléfono en path | `/api/saldo/<telefono>` y JS cliente | PII queda en logs, historial y proxies | Mantener compatibilidad, añadir POST seguro y migrar frontend | `main.py`, `js/rewards.js` | FAIL |
| Validación de entradas | Manual e incompleta | Conversiones ad hoc, sin límites uniformes | abuso, payloads grandes, datos inválidos | Límite global de body y validadores de longitud/tipo | backend | PARTIAL |
| SQL/NoSQL injection | No se usa SQL/NoSQL directo | Almacenamiento local en memoria y Google Sheets APIs | Fórmula injection posible al escribir Sheets | Neutralizar valores iniciados por `=`, `+`, `-`, `@` donde sean texto | `google_memory.py` | PARTIAL |
| XSS | Admin escapa HTML; otras salidas usan `textContent` en rutas vistas | `escapeHtml`, `textContent` | Riesgo bajo, pendiente revisión completa de inline HTML | Pruebas básicas y CSP | frontend | PARTIAL |
| CORS | Allowlist explícita con credenciales | `CORS(... origins=[...], supports_credentials=True)` | Orígenes dev quedan permitidos en producción | Separar allowlist por entorno y probar origen rechazado | `main.py` | PARTIAL |
| Rate limiting | Global y login | 100/h global, login 5/min | Storage en memoria; formularios sensibles sin límites específicos | Backend compartido configurable y límites por endpoint | `main.py` | PARTIAL |
| Headers de seguridad | No configurados centralmente | Sin middleware `after_request` | XSS, framing, MIME sniffing y cache sensible | Añadir headers compatibles; CSP basada en Google Fonts y recursos propios | `main.py` | FAIL |
| HTTPS/HSTS | URLs productivas HTTPS, sin HSTS verificable | URLs Render/GitHub Pages | Downgrade inicial/configuración no comprobada | HSTS sólo en producción; confirmar redirección hosting | backend/hosting | PARTIAL |
| Secretos | Variables de entorno y `.gitignore` presentes | `.env*` ignorados; configuración Google por env | Defaults inseguros y sin `.env.example` | Eliminar default sensible, crear ejemplo y guía de rotación | backend | PARTIAL |
| Secretos en historial | No verificado por limitación de propiedad Git del backend | Git rechazó repo backend como unsafe | Posible secreto histórico | Ejecutar secret scanning autorizado y rotar cualquier hallazgo sin copiar valores | manual | PARTIAL |
| Manejo de errores | Devuelve `str(error)` al cliente | `json_error` y varios 503 | Filtra detalles internos/configuración | Correlation ID y mensajes genéricos en producción | backend | FAIL |
| Logs estructurados/redacción | `print` y Google Sheet audit ad hoc | múltiples `print`, `guardar_log` | PII y secretos en logs; difícil auditoría | Logger estructurado y redacción automática | backend | FAIL |
| Timeouts externos | Ausentes en Messenger; Google SDK administra propios | `requests.post` sin timeout | agotamiento de workers | Timeout explícito y errores seguros | `main.py` | FAIL |
| Cookies/tracking no esencial | No observado | Sin Pixel/analytics/localStorage/cookies JS | Banner no necesario hoy | Documentar cookies esenciales de sesión; no añadir banner | docs | PASS |
| Dependencias | Sin versiones fijas/lock | `requirements.txt` con duplicado `google-auth` | Builds no reproducibles y vulnerabilidades desconocidas | Auditar, eliminar duplicado y fijar versiones después de prueba | backend | FAIL |
| Seguridad de supply chain/CI | No hay CI visible | Sin workflows/manifiestos de análisis | Regresiones no detectadas | Añadir comandos/documentación; no afirmar escaneo no ejecutado | docs/CI | FAIL |
| Panel administrativo | Protegido por sesión y roles | rutas `/api/admin`; pruebas 401/403/CSRF | Assets/login públicos esperado; faltan headers/cache | Añadir no-store y ampliar pruebas | backend | PASS |
| Endpoints de objetos/IDOR | Admin protegido; saldo público por teléfono | rutas admin verificadas; saldo público | BOLA sobre información de recompensas | Autenticación/verificación para consulta de saldo | `main.py` | FAIL |
| Política de backups/logs | Desconocida | No hay configuración en repo | Eliminación incompleta | Placeholders y acción de hosting/Google Workspace | docs | FAIL |
| Hosting y dominio | Frontend confirmado en GitHub Pages; backend aún en Render | `rocketclubos.github.io/Perfiles-y-Metales-Xela/`, fetch y CORS | Cookies/CORS y callbacks dependen también del backend | Confirmar URL definitiva del backend y redirects | hosting/docs | PARTIAL |
| App Review guide | No existe | Sin documentación | Revisor no puede reproducir flujo | Crear guía con placeholders y guiones | `docs/META_APP_REVIEW_GUIDE.md` | FAIL |
| Checklist de producción | No existe | Sin checklist | Configuración manual omitida | Crear checklist verificable | `docs/PRODUCTION_SECURITY_CHECKLIST.md` | FAIL |

## Archivos críticos identificados

- Backend: `main.py`, `google_memory.py`, `admin_routes.py`, `admin_service.py`, `sales_point.py`, `club_xela_db.py`.
- Frontend: `index.html`, `mobile.html`, `rewards.html`, `encuesta.html`, `app.js`, `js/rewards.js`, `admin/*`.
- Configuración: `requirements.txt`, `.gitignore`, variables de entorno de Render/hosting.

## Prioridad de remediación

1. Autenticar y limitar el webhook; retirar payloads sensibles de logs.
2. Crear páginas públicas e inventario fiel de datos.
3. Implementar recepción verificable de solicitudes de eliminación sin enumeración.
4. Añadir headers, límites de payload, errores seguros, timeouts y CORS por entorno.
5. Ampliar pruebas y documentación de App Review/producción.

Esta auditoría no constituye asesoría legal, no garantiza aprobación de Meta y no afirma cumplimiento territorial absoluto.
