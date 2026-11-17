# Cómo contribuir — BALANTA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · **Español** · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versión: 0.2.0 · Última actualización: 2026-11-17

1. Haz un fork de este repositorio.
2. Copia `data/prompts/example.json` en `data/prompts/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Reglas

- Una entrada = un archivo.
- Cita siempre una fuente.
- Aporta solo material que puedas compartir legalmente (sin texto protegido copiado).
- Sé amable: consulta el Código de conducta.

## Añadir prompts y votos

1. Copia `data/prompts/example.json` en `data/prompts/<lang>-<category>-<NNNN>.json`: el nombre del archivo es el `id`, con el siguiente número libre de su grupo (`ro-grammar-0031`).
2. Escribe el `prompt` en el idioma indicado por `lang`, como una pregunta completa que se pueda responder sin abrir un enlace. En `reference_notes` indica qué debe contener una respuesta correcta, en una o dos frases. Para `culture` las notas y al menos una fuente `https` son obligatorias.
3. Lista de control de calidad: sin datos personales (personas privadas, correo, teléfono, CNP, IBAN); sin texto protegido copiado (parafrasea; la aplicación bloquea un pasaje citado de 300 caracteres o más); rumano con los diacríticos con coma (ș, ț), nunca con cedilla; una única respuesta correcta clara o criterios claros; cada hecho comprobado en una fuente, y los hechos que pueden cambiar con el tiempo marcados como tales; una `difficulty` honesta.
4. Ejecuta `python scripts/validate.py` y `npm test`: las pruebas comprueban el esquema, el id y la numeración, las notas y las fuentes, las reglas de la lista de control y los duplicados.
5. Para aportar votos, exporta `votes.jsonl` desde la aplicación (formato en `docs/votes.md`), compruébalo con `python scripts/rank.py votes.jsonl` y adjúntalo a una issue o a un pull request junto con `answers.jsonl` y los nombres exactos, versiones y ajustes de los modelos; nunca incluyas datos personales.
6. La revisión por hablantes nativos de los prompts en húngaro y de traducción es muy bienvenida: abre una issue con el id y la corrección propuesta.
