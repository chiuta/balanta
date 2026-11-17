# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.2.0 · Última actualización: 2026-11-17

🌐 https://balanta.chiuta.ro

> Evaluación ciega y comparada de modelos de IA en rumano — prompts y votos abiertos.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa, utilizable: el único `index.html` compara modelos de IA a ciegas, sin conexión y sin servidor. Pegas las respuestas de dos a ocho modelos a los 92 prompts incluidos (rumano, inglés, húngaro) o a los tuyos, votas A o B sin ver los nombres de los modelos y obtienes una clasificación Bradley–Terry y Elo con intervalos de confianza, una página de resultados estática y un archivo `votes.jsonl` que cualquiera puede recalcular con `scripts/rank.py`. No se envía nada y no se llama a ningún modelo.

## Qué hace

- Incluye 92 prompts como archivos de datos: gramática rumana (30), cultura e historia con fuentes (20), razonamiento (20), traducción RO→EN y EN→RO (10) y un conjunto en húngaro (12). Cada prompt tiene notas de referencia.
- Voto a ciegas: pegas la respuesta de cada modelo, la aplicación oculta los nombres de modelos dentro de las respuestas («[model]»), fija el orden y los lados A/B a partir de una semilla y registra A, B, empate o ambas malas (teclas 1–4, deshacer, revelación opcional tras cada voto).
- Clasificación: Bradley–Terry (la puntuación principal) y Elo, intervalos bootstrap del 95 %, porcentaje de victorias, porcentaje de «ambas malas», influencia de la posición, cara a cara, orden por categoría y por idioma, filtros.
- Formatos abiertos: `votes.jsonl` y `answers.jsonl` (JSON Lines, descritos en `docs/votes.md`), importación que ignora los duplicados y nombra las líneas erróneas, `scripts/rank.py` que recalcula la misma tabla sin bibliotecas, una página de resultados estática y una tabla Markdown.
- Tus propios prompts, comprobados automáticamente (correo, teléfono, CNP, IBAN, citas largas, diacríticos rumanos) y exportados como archivo JSON listo para un pull request; interfaz en ocho idiomas, temas oscuro y claro, teclado, funciona desde 360 px de ancho; los datos se quedan en el navegador, sin red, sin rastreo.
- Instalable como aplicación y disponible sin conexión tras la primera visita cuando se sirve por HTTPS (un service worker conserva la página; no se guarda ni se envía nada más). Abierta desde un archivo descargado funciona igual, sin instalación.

## Cómo funciona

- Un archivo JSON por prompt en `data/prompts/`, comprobado por `schema.json`; `docs/votes.md` (y `docs/votes.ro.md`) describe el formato de los votos, los algoritmos y la lista de control de calidad de los prompts.
- `src/engine.mjs` es el motor (sin pantalla, sin red): formato de los votos, Elo, Bradley–Terry (con un rival virtual de anclaje para que los modelos invictos o sin victorias obtengan puntuaciones finitas), bootstrap, emparejamientos a partir de un hash de la semilla, anonimización, comprobación de prompts y exportaciones. `scripts/rank.py` rehace la misma aritmética en Python sin bibliotecas; las pruebas comparan ambos a 1e-6.
- `src/ui.js`, `src/i18n.mjs` y `src/app.css` son la interfaz; `node scripts/build.mjs` construye el único `index.html` (`--check` verifica que coincide).
- `npm test` ejecuta las pruebas del motor, de los archivos de datos y de los textos de la interfaz; `python scripts/validate.py` comprueba los archivos JSON; las pruebas de navegador están en el hub. El desarrollo requiere Node.js 24 o más reciente; la página en sí solo necesita un navegador que conozca ES2017.
- `manifest.webmanifest`, `sw.js` y los iconos los produce `node scripts/build.mjs` mediante el kit común (sección `pwa` de `src/app.json`); `--check` también los verifica, y `npm test` comprueba que el manifiesto, la versión del service worker y la CSP coincidan con la página.

## Límites y lo que no hace

- No llama a ningún modelo: las respuestas las pegas tú. No hay claves de API, cuentas ni servidores.
- El voto a ciegas vale lo que vale la anonimización: la aplicación oculta los nombres de modelos conocidos, pero el estilo de una respuesta aún puede delatar a su autor.
- La clasificación refleja las preferencias de quienes votan sobre los prompts elegidos; con pocos votos o pocos prompts no dice nada general sobre los modelos.
- Los prompts incluidos se redactaron con un asistente de IA; los húngaros y los de traducción esperan en especial la revisión de hablantes nativos. Los hechos de «cultura» tienen fuentes, pero pueden quedar desfasados.
- Elo depende del orden de los votos; Bradley–Terry no. Los intervalos son aproximados (bootstrap sobre los votos, no sobre los prompts).
- Los datos se guardan en localStorage (unos 5 MB por sitio): en sesiones grandes, exporta con regularidad votes.jsonl y answers.jsonl.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/prompts/example.json` en `data/prompts/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.
5. Para cambiar el motor o la interfaz, edita `src/` y ejecuta `npm test` y `node scripts/build.mjs` (consulta `CONTRIBUTING.md`).

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
