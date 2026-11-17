# Buenas primeras tareas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · **Español** · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Pedir a hablantes nativos que revisen los 12 prompts en húngaro y los 10 prompts de traducción (RO→EN, EN→RO): redacción, notas de referencia y elección de las expresiones idiomáticas
- [ ] Volver a comprobar los hechos de los 22 prompts de cultura en sus fuentes, añadir una segunda fuente a cada uno y marcar los hechos que pueden cambiar con el tiempo
- [ ] Añadir 20 prompts en rumano para la categoría `law` (nociones constitucionales, derechos del consumidor, contratos), con notas de referencia y fuentes oficiales
- [ ] Añadir 20 prompts en rumano para la categoría `science` (física, química, biología, matemáticas), con respuestas de referencia verificadas
- [ ] Añadir prompts `creative` (texto breve, rima, registro) cuyas notas de referencia den criterios de valoración claros y que no pidan reproducir obras protegidas
- [ ] Añadir prompts `code` (tareas breves en Python y JavaScript, con comentarios en rumano) cuyas notas de referencia incluyan una prueba que compruebe la respuesta
- [ ] Añadir conjuntos de prompts en francés, alemán, italiano, español o portugués para las categorías que encajen (la interfaz y el esquema ya aceptan estos idiomas)
- [ ] Escribir `scripts/agreement.py`: cuando dos personas votan los mismos pares, informar de su acuerdo (kappa de Cohen) y de los pares en que difieren, con pruebas sobre un ejemplo pequeño
- [ ] Escribir un script auxiliar que convierta la salida de un ejecutor local de modelos en `answers.jsonl` (sin claves de API en el repositorio, sin llamadas de red desde la página)
- [ ] Añadir a `src/engine.mjs` y a `scripts/rank.py` un bootstrap sobre los prompts (y no solo sobre los votos), mostrar ambos intervalos en los resultados y comprobar que los dos programas coinciden

Créalas todas en GitHub con `scripts/create_issues.sh` (requiere la CLI `gh`).
