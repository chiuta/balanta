# Bonnes premières tâches

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · **Français** · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Faire relire par des locuteurs natifs les 12 prompts en hongrois et les 10 prompts de traduction (RO→EN, EN→RO) : formulations, notes de référence et choix des expressions idiomatiques
- [ ] Revérifier les faits des 22 prompts de culture dans leurs sources, ajouter une seconde source à chacun et signaler les faits susceptibles de changer
- [ ] Ajouter 20 prompts en roumain pour la catégorie `law` (notions constitutionnelles, droits des consommateurs, contrats), avec notes de référence et sources officielles
- [ ] Ajouter 20 prompts en roumain pour la catégorie `science` (physique, chimie, biologie, mathématiques), avec des réponses de référence vérifiées
- [ ] Ajouter des prompts `creative` (texte court, rime, registre) dont les notes de référence donnent des critères d’appréciation clairs et qui ne demandent pas de reproduire des œuvres protégées
- [ ] Ajouter des prompts `code` (courtes tâches en Python et JavaScript, avec commentaires en roumain) dont les notes de référence incluent un test qui vérifie la réponse
- [ ] Ajouter des jeux de prompts en français, allemand, italien, espagnol ou portugais pour les catégories qui s’y prêtent (l’interface et le schéma acceptent déjà ces langues)
- [ ] Écrire `scripts/agreement.py` : quand deux personnes votent les mêmes paires, indiquer leur accord (kappa de Cohen) et les paires où elles divergent, avec des tests sur un petit exemple
- [ ] Écrire un script d’aide qui transforme la sortie d’un exécuteur local de modèles en `answers.jsonl` (pas de clés d’API dans le dépôt, pas d’appels réseau depuis la page)
- [ ] Ajouter à `src/engine.mjs` et à `scripts/rank.py` un bootstrap sur les prompts (et pas seulement sur les votes), afficher les deux intervalles dans les résultats et tester que les deux programmes concordent

Créez-les toutes sur GitHub avec `scripts/create_issues.sh` (nécessite la CLI `gh`).
