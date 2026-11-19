# Journal des modifications

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · **Français** · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non publié]

## [0.2.1] - 2026-11-20

### Modifié
- fff-kit 1.8.1 : lorsque le navigateur bloque le stockage ou en est dépourvu (`localStorage`/`sessionStorage` lèvent une erreur ou sont absents), la page démarre avec un stockage temporaire en mémoire au lieu de s’arrêter ; les données ne sont pas conservées après la fermeture de la page.
- fff-kit 1.8.1 : le dispositif qui agrandit les petits contrôles à 44 px mesure désormais aussi la largeur du corps de la page et de l’élément parent ; une rangée de boutons ne peut donc plus sortir de l’écran (le groupe reste inchangé lorsque l’agrandissement le ferait déborder).

## [0.2.0] - 2026-11-17

### Ajouté
- Le moteur de `src/engine.mjs` : votes en JSON Lines (`votes.jsonl`, versionné, avec un code d’erreur nommé pour chaque ligne fautive), Elo, Bradley–Terry avec intervalles bootstrap, face à face, influence de la position, appariement à partir d’une graine, anonymisation, vérification des prompts, exports Markdown et HTML statique.
- `scripts/rank.py` : le même classement en Python sans bibliothèque ; les tests vérifient qu’il concorde avec le moteur JavaScript à 1e-6.
- 92 prompts dans `data/prompts/` : grammaire roumaine (30), culture et histoire avec sources (20), raisonnement (20), traduction RO→EN et EN→RO (10) et un jeu en hongrois (12), tous avec notes de référence ; `schema.json` rejette désormais les champs inconnus et accepte `sources`.
- Interface dans `src/ui.js`, `src/i18n.mjs` et `src/app.css` : préparation, réponses, vote à l’aveugle, résultats et vos propres prompts ; huit langues, thèmes sombre et clair, clavier, utilisable dès 360 px de large ; les données restent dans le navigateur.
- `docs/votes.md` et `docs/votes.ro.md` : le format des votes, les algorithmes et la liste de contrôle de qualité des prompts (aussi dans `CONTRIBUTING.md`).
- Tests : `npm test` (le moteur, les fichiers de données et les textes de l’interface) et tests de navigateur dans le hub (huit langues, accessibilité, état stocké hostile, import et export, petits écrans).
- `src/` et `scripts/build.mjs` : l’unique `index.html` est désormais construit à partir des sources, et `--check` le vérifie.
- ISSUES_GOOD_FIRST et CODE_OF_CONDUCT traduits dans les huit langues.
- README en anglais, roumain, français, italien, espagnol, portugais, allemand et hongrois : sections d’état et de périmètre prévu (dérivées de `ISSUES_GOOD_FIRST.md`).
- Installable (PWA) : `manifest.webmanifest`, `sw.js` et les icônes sont générés par le kit commun (`fff-kit/pwa`) ; la page fonctionne hors ligne après la première visite en HTTPS.

### Modifié
- Le workflow s’exécute sur Ubuntu 26.04 avec Node.js 26 et lance aussi les tests, la vérification de la construction et la validation des données.
- `data/prompts/example.json` est désormais un modèle avec l’id réservé `ro-culture-0000` ; il ne fait pas partie du jeu fourni.

## [0.1.0] - 2026-11-13

### Ajouté
- Squelette initial : structure, schéma de données ou premiers exemples, guides de contribution en huit langues.
