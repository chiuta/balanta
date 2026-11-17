# Registro de cambios

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · **Español** · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Sin publicar]

## [0.2.0] - 2026-11-17

### Añadido
- El motor en `src/engine.mjs`: votos en JSON Lines (`votes.jsonl`, con versión y un código de error con nombre para cada línea errónea), Elo, Bradley–Terry con intervalos bootstrap, cara a cara, influencia de la posición, emparejamientos a partir de una semilla, anonimización, comprobación de prompts, exportaciones Markdown y HTML estático.
- `scripts/rank.py`: la misma clasificación en Python sin bibliotecas; las pruebas comprueban que coincide con el motor JavaScript a 1e-6.
- 92 prompts en `data/prompts/`: gramática rumana (30), cultura e historia con fuentes (20), razonamiento (20), traducción RO→EN y EN→RO (10) y un conjunto en húngaro (12), todos con notas de referencia; `schema.json` rechaza ahora los campos desconocidos y acepta `sources`.
- Interfaz en `src/ui.js`, `src/i18n.mjs` y `src/app.css`: preparación, respuestas, voto a ciegas, resultados y tus propios prompts; ocho idiomas, temas oscuro y claro, teclado, funciona desde 360 px de ancho; los datos se quedan en el navegador.
- `docs/votes.md` y `docs/votes.ro.md`: el formato de los votos, los algoritmos y la lista de control de calidad de los prompts (también en `CONTRIBUTING.md`).
- Pruebas: `npm test` (el motor, los archivos de datos y los textos de la interfaz) y pruebas de navegador en el hub (ocho idiomas, accesibilidad, estado guardado hostil, importación y exportación, pantallas pequeñas).
- `src/` y `scripts/build.mjs`: el único `index.html` se construye ahora a partir de las fuentes, y `--check` lo verifica.
- ISSUES_GOOD_FIRST y CODE_OF_CONDUCT traducidos a los ocho idiomas.
- README en inglés, rumano, francés, italiano, español, portugués, alemán y húngaro: secciones de estado y de alcance previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalable (PWA): `manifest.webmanifest`, `sw.js` y los iconos los genera el kit común (`fff-kit/pwa`); la página funciona sin conexión tras la primera visita por HTTPS.

### Cambiado
- El workflow se ejecuta en Ubuntu 26.04 con Node.js 26 y ejecuta también las pruebas, la comprobación de la compilación y la validación de los datos.
- `data/prompts/example.json` es ahora una plantilla con el id reservado `ro-culture-0000`; no forma parte del conjunto incluido.

## [0.1.0] - 2026-11-13

### Añadido
- Esqueleto inicial: estructura, esquema de datos o primeros ejemplos, guías de contribución en ocho idiomas.
