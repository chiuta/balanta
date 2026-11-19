# BALANTA

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.2.1 · Dernière mise à jour : 2026-11-20

🌐 https://balanta.chiuta.ro

> Évaluation à l'aveugle, côte à côte, de modèles d'IA en roumain — prompts et votes publics.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha, utilisable : l’unique `index.html` compare des modèles d’IA à l’aveugle, hors ligne et sans serveur. Vous collez les réponses de deux à huit modèles aux 92 prompts fournis (roumain, anglais, hongrois) ou aux vôtres, vous votez A ou B sans voir les noms des modèles, et vous obtenez un classement Bradley–Terry et Elo avec intervalles de confiance, une page de résultats statique et un fichier `votes.jsonl` que chacun peut recalculer avec `scripts/rank.py`. Rien n’est envoyé et aucun modèle n’est appelé.

## Ce que fait l’application

- Fournit 92 prompts sous forme de fichiers de données : grammaire roumaine (30), culture et histoire avec sources (20), raisonnement (20), traduction RO→EN et EN→RO (10) et un jeu en hongrois (12). Chaque prompt a des notes de référence.
- Vote à l’aveugle : vous collez la réponse de chaque modèle, l’application masque les noms de modèles dans les réponses (« [model] »), fixe l’ordre et les côtés A/B à partir d’une graine et enregistre A, B, égalité ou les deux mauvaises (touches 1 à 4, annuler, affichage facultatif après chaque vote).
- Classement : Bradley–Terry (le score principal) et Elo, intervalles bootstrap à 95 %, taux de victoires, taux de « les deux mauvaises », influence de la position, face à face, ordre par catégorie et par langue, filtres.
- Formats ouverts : `votes.jsonl` et `answers.jsonl` (JSON Lines, décrits dans `docs/votes.md`), import qui ignore les doublons et nomme les lignes fautives, `scripts/rank.py` qui recalcule le même tableau sans bibliothèque, une page de résultats statique et un tableau Markdown.
- Vos propres prompts, vérifiés automatiquement (e-mail, téléphone, CNP, IBAN, longues citations, diacritiques roumains) et exportés en fichier JSON prêt pour une pull request ; interface en huit langues, thèmes sombre et clair, clavier, utilisable dès 360 px de large ; les données restent dans le navigateur, sans réseau, sans suivi.
- Installable comme une application et disponible hors ligne après la première visite lorsqu’elle est servie en HTTPS (un service worker conserve la page ; rien d’autre n’est stocké ni envoyé). Ouverte depuis un fichier téléchargé, elle fonctionne de la même manière, sans installation.

## Comment ça marche

- Un fichier JSON par prompt dans `data/prompts/`, vérifié par `schema.json` ; `docs/votes.md` (et `docs/votes.ro.md`) décrit le format des votes, les algorithmes et la liste de contrôle de qualité des prompts.
- `src/engine.mjs` est le moteur (sans écran, sans réseau) : format des votes, Elo, Bradley–Terry (avec un adversaire virtuel d’ancrage pour que les modèles invaincus ou sans victoire aient des scores finis), bootstrap, appariement à partir d’un hachage de la graine, anonymisation, vérification des prompts et exports. `scripts/rank.py` refait le même calcul en Python sans bibliothèque ; les tests comparent les deux à 1e-6.
- `src/ui.js`, `src/i18n.mjs` et `src/app.css` forment l’interface ; `node scripts/build.mjs` construit l’unique `index.html` (`--check` vérifie qu’il correspond).
- `npm test` lance les tests du moteur, des fichiers de données et des textes de l’interface ; `python scripts/validate.py` vérifie les fichiers JSON ; les tests de navigateur sont dans le hub. Le développement demande Node.js 24 ou plus récent ; la page elle-même n’exige qu’un navigateur qui connaît ES2017.
- `manifest.webmanifest`, `sw.js` et les icônes sont produits par `node scripts/build.mjs` via le kit commun (section `pwa` de `src/app.json`) ; `--check` les vérifie aussi, et `npm test` contrôle que le manifeste, la version du service worker et la CSP correspondent à la page.

## Limites et ce que l’outil ne fait pas

- Elle n’appelle aucun modèle : vous collez vous-même les réponses. Il n’y a ni clé API, ni compte, ni serveur.
- Le vote à l’aveugle vaut ce que vaut l’anonymisation : l’application masque les noms de modèles connus, mais le style d’une réponse peut quand même trahir son auteur.
- Le classement reflète les préférences des votants sur les prompts choisis ; avec peu de votes ou peu de prompts, il ne dit rien de général sur les modèles.
- Les prompts fournis ont été rédigés avec un assistant d’IA ; ceux en hongrois et ceux de traduction attendent en particulier une relecture par des locuteurs natifs. Les faits de « culture » ont des sources, mais peuvent devenir obsolètes.
- Elo dépend de l’ordre des votes ; Bradley–Terry non. Les intervalles sont approximatifs (bootstrap sur les votes, pas sur les prompts).
- Les données sont dans localStorage (environ 5 Mo par site) : pour de grandes sessions, exportez régulièrement votes.jsonl et answers.jsonl.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/prompts/example.json` dans `data/prompts/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.
5. Pour modifier le moteur ou l’interface, éditez `src/`, puis lancez `npm test` et `node scripts/build.mjs` (voir `CONTRIBUTING.md`).

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
