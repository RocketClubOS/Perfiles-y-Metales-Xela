# Checklist de producción y Meta

Actualizado: 2026-07-31. Marcar únicamente con evidencia.

## Hosting

- [x] Frontend definitivo: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/`.
- [ ] Confirmar URL definitiva del backend de webhooks y API.
- [ ] HTTPS válido y redirección HTTP→HTTPS.
- [ ] HSTS verificado en producción.
- [ ] Base Google Sheet productiva con acceso mínimo.
- [ ] Backups, restauración probada, expiración y borrado documentados.
- [ ] `FLASK_ENV=production`; debug desactivado; Gunicorn/WSGI.
- [ ] `ALLOWED_ORIGINS` exacto, sin orígenes locales.
- [ ] Redis u otro `RATELIMIT_STORAGE_URI` compartido.
- [ ] CSP probada sin recursos bloqueados; headers y cookies verificados.
- [ ] Logs, redacción, retención y alertas configurados.
- [ ] Variables del `.env.example` configuradas; secretos rotados.

## Aplicación

- [ ] Política, términos, eliminación y contacto públicos con datos legales reales.
- [ ] No quedan placeholders visibles.
- [ ] Proceso humano de identidad y runbook de eliminación aprobado.
- [ ] Rutas admin y ventas protegidas; CSRF de ventas decidido/probado.
- [ ] Tests, lint, type check, dependency audit y build aprobados.
- [ ] Enlaces externos con `noopener noreferrer`; enlaces rotos revisados.
- [ ] Cuenta de revisor y datos sintéticos preparados.

## Meta Developer Dashboard

- [ ] Business Verification completada cuando corresponda.
- [ ] App ID/nombre/icono/descripción/dominio consistentes.
- [ ] Privacy URL: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/privacy.html`.
- [ ] Terms URL: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/terms.html`.
- [ ] Data deletion URL: `https://rocketclubos.github.io/Perfiles-y-Metales-Xela/data-deletion.html`; callback oficial pendiente de confirmar.
- [ ] Deauthorize callback configurado cuando aplique.
- [ ] App Domains y redirect URIs exactos; no hay comodines.
- [ ] `VERIFY_TOKEN`, `META_APP_SECRET` y token de Página rotados/configurados.
- [ ] Suscripciones webhook reducidas a eventos realmente usados.
- [ ] Permisos mínimos confirmados y justificados con videos.
- [ ] Modo de app, usuarios/roles de prueba y cuenta del revisor verificados.
