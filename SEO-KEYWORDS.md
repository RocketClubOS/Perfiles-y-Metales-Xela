# Investigación de palabras clave: Perfiles y Metales Xela

Fecha: 26 de octubre de 2026

## Alcance y límites

- Es un análisis de **intención de búsqueda y vocabulario local**, hecho con la estructura del catálogo, el vocabulario de fabricantes y listados de Guatemala y búsquedas web.
- **No incluye volúmenes de búsqueda medidos.** No hubo acceso a Ahrefs, Semrush ni Google Keyword Planner. Los volúmenes reales se obtienen de Google Search Console (ya está verificado en el sitio) después de 4 a 6 semanas.
- Al buscar proveedores de costaneras, lámina, perfiles y tubos en Quetzaltenango no aparecieron competidores locales con contenido propio. La competencia local en línea parece baja: la oportunidad es ser el primer resultado claro para "X en Quetzaltenango".

## Cómo busca el cliente (7 grupos)

| # | Grupo | Intención | Palabras clave (variantes locales) | Página que responde |
|---|---|---|---|---|
| 1 | Marca y ubicación | Navegacional | perfiles y metales xela, perfiles y metales quetzaltenango, ferretería de metales xela, tienda de hierro quetzaltenango, venta de metales xela, metales zona 2 quetzaltenango | `index.html`, `contact.html` |
| 2 | Techos | Comercial | costaneras quetzaltenango, costanera galvanizada, costanera perfil C, polín para techo, lámina para techo xela, lámina galvanizada quetzaltenango, lámina acanalada / ondulada / troquelada, cumbrera (capote), canal para techo, tornillo punta de broca | `materiales/costaneras-quetzaltenango.html`, `materiales/lamina-techo-quetzaltenango.html` |
| 3 | Tubos y perfiles | Comercial | tubo cuadrado quetzaltenango, tubo rectangular, tubo redondo, tubo galvanizado, tubo negro, tubo para portón, perfil cuadrado, perfil rectangular, tubo estructural | `materiales/tubos-metalicos-quetzaltenango.html`, `materiales/perfiles-metalicos-quetzaltenango.html` |
| 4 | Hierro y estructuras | Comercial | platina, hierro plano, solera, ángulo de hierro, viga, canal, varilla corrugada, hierro redondo | `materiales/hierro-platina-angulo-quetzaltenango.html` |
| 5 | Herrería y soldadura | Comercial | materiales para herrería xela, electrodos Lincoln, electrodo 6011 / 6013 / 7018, discos de corte, disco de desbaste, pintura anticorrosiva, thinner, pintura Corona | `materiales/materiales-herreria-quetzaltenango.html` |
| 6 | Proyectos terminados | Comercial / local | portón de metal xela, puertas metálicas quetzaltenango, barandales, cochera metálica, gallinero, cerco con malla, galera metálica | `materiales/portones-puertas-barandales-quetzaltenango.html`, `materiales/mallas-alambres-cercos-quetzaltenango.html` |
| 7 | Precio y cotización | Transaccional | precio de lámina guatemala, precio de costanera, precio del hierro guatemala, cuánto cuesta un portón, cotizar materiales por whatsapp | `blog/precio-acero-guatemala.html`, `blog/factores-precio-porton-metal.html`, `blog/cotizar-materiales-metal-por-whatsapp-datos.html` |
| 8 | Cómo hacerlo | Informacional | cuántas láminas necesito, medidas de lámina, calibres de lámina, peso de varilla, cómo evitar óxido, cómo calcular varilla para losa | artículos del blog (58 en total) |

## Vocabulario guatemalteco confirmado (usar tal cual)

- **Costanera** = perfil C / larguero de techo (también "polín").
- **Lámina acanalada**, también llamada **ondulada** o **troquelada** según el comercio.
- **Cumbrera**, también llamada **capote**.
- **Platina** = hierro plano = solera.
- **Calibre**: número mayor = más delgado (lámina 26 y 28 son comunes en techos).
- Medidas de referencia de un fabricante regional para lámina galvanizada acanalada: ancho total 1,066 mm y ancho útil 1,010 mm. Esto es distinto del 0.80 m usado como ejemplo ilustrativo en el artículo de cálculo de láminas; conviene aclararlo ahí.

## Qué se aplicó en el sitio

1. **Inicio** (`index.html`, `mobile.html`): título y descripción nuevos con "Tubos, Lámina y Costaneras en Xela", canonical, etiquetas OG, esquema `HardwareStore` con catálogo y zona de servicio, esquema `FAQPage`, sección "Materiales metálicos en Quetzaltenango" con enlaces a las 8 páginas de categoría y 4 preguntas frecuentes nuevas.
2. **Productos** (`productos.html`): título, descripción, canonical, texto alternativo de cada imagen con la palabra clave, "Costaneras" añadido a la tarjeta de Techos y bloque de guías por categoría.
3. **9 páginas en `materiales/`**: la guía principal `guia-metal-en-xela.html` (apunta a "metal en Xela" y enlaza todo el sitio) más 8 páginas de categoría, una por grupo comercial, con esquema `WebPage`, `BreadcrumbList` y `FAQPage`, preguntas frecuentes, enlaces a los artículos del blog y WhatsApp.
4. **Contacto** (`contact.html`): título y descripción con dirección.
5. **7 artículos educativos nuevos** (segunda ronda): glosario de metal y herrería (con esquema `DefinedTermSet`), tipos de metal, fórmulas de peso del acero, costanera frente a tubo como larguero, postes para cercos, galera metálica y 15 ideas de proyectos con metal.
6. **Enlaces internos**: cada uno de los 58 artículos del blog enlaza a 2 páginas de categoría o a la guía principal.
7. **Técnico**: esquema `WebSite` y logo en el inicio, `lastmod` real en las 76 URL del sitemap, página `404.html` con enlaces útiles.
8. **Corrección**: el ejemplo del artículo de cálculo de láminas ahora usa un ancho útil realista (1.01 m).

## Pendientes recomendados

1. **Google Business Profile** (Google Maps): es lo que más pesa en búsquedas como "ferretería cerca de mí Quetzaltenango". Fichas con dirección, teléfono, horario, fotos y categoría "Tienda de metales" o "Ferretería".
2. **Dominio propio.** Hoy el sitio vive en `rocketclubos.github.io/...`, un subdominio de GitHub que limita el posicionamiento de marca. Un dominio tipo `perfilesymetalesxela.com` ayuda mucho.
3. **Fotos propias** de producto con nombre de archivo descriptivo y texto alternativo.
4. **Confirmar con la tienda**: horario real (el sitio mostraba dos versiones), qué costaneras y calibres manejan realmente, y si hacen entregas, para afinar las páginas.
5. **Artículos futuros** (aún no existen): varilla corrugada y tamaños comunes, comparativos de precio por temporada, aluzinc frente a galvanizado y vídeos cortos de cada guía.
6. **Medición**: a las 4 a 6 semanas, revisar en Search Console las consultas reales, ajustar títulos con baja tasa de clics y crear artículos para las consultas con impresiones sin página específica.
