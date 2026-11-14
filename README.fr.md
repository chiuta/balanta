# BALANTA

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.1.0 · Dernière mise à jour : 2026-11-14

🌐 https://balanta.chiuta.ro

> Évaluation à l'aveugle, côte à côte, de modèles d'IA en roumain — prompts et votes publics.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha : le dépôt contient la structure, le schéma de données ou les premiers exemples et les guides de contribution. Le périmètre ci-dessous est le plan, pas ce qui fonctionne aujourd’hui.

## Périmètre prévu

- Des jeux de requêtes en roumain : 30 de grammaire (diacritiques, `s-au/sau`, `i-a/ia`, césure), 20 de culture et d’histoire avec notes de référence et sources, 20 de raisonnement et 10 de traduction RO↔EN avec expressions idiomatiques.
- Un jeu de requêtes en hongrois (lang hu) pour les utilisateurs de Transylvanie.
- Un format d’export des votes (`votes.jsonl`) et un classement Bradley–Terry / Elo dans `scripts/rank.py`.
- Anonymisation : noms de modèles retirés des réponses affichées, et liste de contrôle de la qualité des requêtes (pas de données personnelles, pas de texte protégé).
- Un générateur de page statique de résultats.

Rien de tout cela n’est encore implémenté : chaque point est une tâche prête dans `ISSUES_GOOD_FIRST.md`.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/prompts/example.json` dans `data/prompts/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
