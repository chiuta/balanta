# Contribuer — BALANTA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · **Français** · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version : 0.2.1 · Dernière mise à jour : 2026-11-20

1. Forkez ce dépôt.
2. Copiez `data/prompts/example.json` dans `data/prompts/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Règles

- Une entrée = un fichier.
- Citez toujours une source.
- Ne contribuez qu'avec du matériel que vous pouvez légalement partager (pas de texte protégé copié).
- Soyez bienveillant : voir le Code de conduite.

## Ajouter des prompts et des votes

1. Copiez `data/prompts/example.json` vers `data/prompts/<lang>-<category>-<NNNN>.json` : le nom du fichier est l’`id`, avec le prochain numéro libre de son groupe (`ro-grammar-0031`).
2. Rédigez le `prompt` dans la langue donnée par `lang`, comme une question complète à laquelle on peut répondre sans ouvrir un lien. Dans `reference_notes`, dites ce qu’une bonne réponse doit contenir, en une ou deux phrases. Pour `culture`, les notes et au moins une source `https` sont obligatoires.
3. Liste de contrôle de qualité : pas de données personnelles (personnes privées, e-mail, téléphone, CNP, IBAN) ; pas de texte protégé copié (paraphrasez ; l’application bloque un passage cité de 300 caractères ou plus) ; roumain avec les diacritiques à virgule (ș, ț), jamais la cédille ; une seule bonne réponse claire ou des critères clairs ; chaque fait vérifié dans une source, et les faits susceptibles de changer signalés comme tels ; une `difficulty` honnête.
4. Lancez `python scripts/validate.py` et `npm test` : les tests vérifient le schéma, l’id et la numérotation, les notes et les sources, les règles de la liste de contrôle et les doublons.
5. Pour apporter des votes, exportez `votes.jsonl` depuis l’application (format dans `docs/votes.md`), vérifiez-le avec `python scripts/rank.py votes.jsonl` et joignez-le à une issue ou à une pull request avec `answers.jsonl` et les noms exacts, versions et réglages des modèles ; n’incluez jamais de données personnelles.
6. La relecture des prompts en hongrois et de traduction par des locuteurs natifs est la bienvenue : ouvrez une issue avec l’id et la correction proposée.
