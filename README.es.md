# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.1.0 · Última actualización: 2026-11-14

🌐 https://balanta.chiuta.ro

> Evaluación ciega y comparada de modelos de IA en rumano — prompts y votos abiertos.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa: el repositorio contiene la estructura, el esquema de datos o los primeros ejemplos y las guías de contribución. El alcance de abajo es el plan, no lo que funciona hoy.

## Alcance previsto

- Conjuntos de prompts en rumano: 30 de gramática (signos diacríticos, `s-au/sau`, `i-a/ia`, silabeo), 20 de cultura e historia con notas de referencia y fuentes, 20 de razonamiento y 10 de traducción RO↔EN con modismos.
- Un conjunto de prompts en húngaro (lang hu) para usuarios de Transilvania.
- Un formato de exportación de votos (`votes.jsonl`) y clasificación Bradley–Terry / Elo en `scripts/rank.py`.
- Anonimización: nombres de modelos eliminados de las respuestas mostradas, y una lista de comprobación de calidad de los prompts (sin datos personales, sin texto protegido).
- Un generador de página estática de resultados.

Nada de esto está implementado todavía: cada punto es una tarea preparada en `ISSUES_GOOD_FIRST.md`.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/prompts/example.json` en `data/prompts/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
