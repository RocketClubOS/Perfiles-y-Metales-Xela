# Changelog de preparación para Meta

Fecha: 2026-07-31

Datos confirmados por el propietario: nombre legal **Perfiles y Metales Xela** y correo de privacidad **rocketclub90@gmail.com**.

También se confirmaron la dirección en 10 Calle A 5-29, Zona 2, Quetzaltenango, Guatemala; ley aplicable de Guatemala; frontend público en GitHub Pages; períodos de retención y política de backups. Se retiró la fecha de nacimiento del formulario y de los nuevos payloads, manteniendo compatibilidad con la columna histórica.

Para backups se adoptó el calendario detallado proporcionado por el propietario —30 días diarios, 3 meses semanales y 12 meses mensuales—, que sustituye el resumen general de 90 días.

| Archivo | Cambio / motivo | Riesgo corregido | Compatibilidad | Pruebas / acción pendiente |
|---|---|---|---|---|
| `docs/META_COMPLIANCE_AUDIT.md` | Auditoría inicial basada en código | Falta de trazabilidad | Sólo documentación | Revisar con propietario |
| `privacy.html`, `terms.html`, `contact.html`, `data-deletion.html`, `legal.css` | Páginas públicas aditivas | Transparencia/App Review | No cambia rutas existentes | Completar placeholders |
| HTML públicos y `style.css` | Enlaces legales en footer | Páginas difíciles de descubrir | Cambio visual mínimo | QA visual en producción |
| backend `main.py` | Firma HMAC de webhook, token sin default, bearer header, timeout, dedupe, headers, correlation ID, límite de payload y rutas legales | Falsificación, filtración, replay básico, hardening | Endpoints existentes conservados; ahora Meta debe firmar POST | Configurar secretos y probar webhook real |
| backend `main.py` | Recepción/estado de solicitud de eliminación en Google Sheets | Ausencia de mecanismo | Rutas nuevas | Crear acceso operativo y proceso de verificación/borrado |
| backend `.env.example`, `SECURITY.md` | Variables y rotación | Configuración insegura | Sólo configuración/docs | Usar Redis y gestor de secretos |
| `docs/DATA_INVENTORY.md` | Matriz de datos | Retención/finalidad desconocida | Sólo documentación | Aprobar períodos y minimización |
| `docs/META_APP_REVIEW_GUIDE.md` | Flujo, permisos y videos | Envío incompleto | Sólo documentación | Completar Dashboard |
| `docs/PRODUCTION_SECURITY_CHECKLIST.md` | Controles manuales | Omisiones de despliegue | Sólo documentación | Cerrar antes de review |
| backend `tests/test_meta_compliance.py` | Pruebas de rutas, headers, CORS, firma y eliminación | Regresiones | Aditivo | Ejecutar suite completa |

La eliminación efectiva no se marca automáticamente como COMPLETED: un operador debe verificar identidad, ejecutar borrado/anonimización en cada sistema, atender backups conforme a la política aprobada y actualizar el estado.

## Resultados reales de validación

- Línea base: 23/23 pruebas aprobadas.
- Después de cambios: 30/30 pruebas aprobadas en 12.561 s.
- Cobertura nueva: rutas legales públicas, headers, CORS rechazado, firma Meta válida/ausente/inválida, validación y persistencia de solicitudes.
- `compileall`, `pip check` y `pip-audit`: no ejecutados correctamente. El entorno virtual falló al iniciar esos comandos con `ModuleNotFoundError: encodings`; no se consideran aprobados.
- Linter/type checker/build frontend: no existen configurados en el repositorio.
- Consulta a documentación oficial de Meta: el servidor devolvió HTTP 429 durante esta ejecución; se requiere una verificación manual posterior.
