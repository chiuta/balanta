# Registo de alterações

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · **Português** · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Não lançado]

## [0.2.0] - 2026-11-17

### Adicionado
- O motor em `src/engine.mjs`: votos em JSON Lines (`votes.jsonl`, com versão e um código de erro com nome para cada linha errada), Elo, Bradley–Terry com intervalos bootstrap, frente a frente, influência da posição, emparelhamentos a partir de uma semente, anonimização, verificação dos prompts, exportações Markdown e HTML estático.
- `scripts/rank.py`: a mesma classificação em Python sem bibliotecas; os testes verificam que concorda com o motor JavaScript a 1e-6.
- 92 prompts em `data/prompts/`: gramática romena (30), cultura e história com fontes (20), raciocínio (20), tradução RO→EN e EN→RO (10) e um conjunto em húngaro (12), todos com notas de referência; `schema.json` rejeita agora os campos desconhecidos e aceita `sources`.
- Interface em `src/ui.js`, `src/i18n.mjs` e `src/app.css`: preparação, respostas, votação às cegas, resultados e os seus próprios prompts; oito idiomas, temas escuro e claro, teclado, funciona desde 360 px de largura; os dados ficam no navegador.
- `docs/votes.md` e `docs/votes.ro.md`: o formato dos votos, os algoritmos e a lista de verificação da qualidade dos prompts (também em `CONTRIBUTING.md`).
- Testes: `npm test` (o motor, os ficheiros de dados e os textos da interface) e testes de navegador no hub (oito idiomas, acessibilidade, estado guardado hostil, importação e exportação, ecrãs pequenos).
- `src/` e `scripts/build.mjs`: o único `index.html` é agora construído a partir das fontes, e `--check` verifica-o.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT traduzidos para as oito línguas.
- README em inglês, romeno, francês, italiano, espanhol, português, alemão e húngaro: secções de estado e de âmbito previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalável (PWA): `manifest.webmanifest`, `sw.js` e os ícones são gerados pelo kit comum (`fff-kit/pwa`); a página funciona offline após a primeira visita por HTTPS.

### Alterado
- O workflow corre em Ubuntu 26.04 com Node.js 26 e executa também os testes, a verificação da compilação e a validação dos dados.
- `data/prompts/example.json` é agora um modelo com o id reservado `ro-culture-0000`; não faz parte do conjunto incluído.

## [0.1.0] - 2026-11-13

### Adicionado
- Esqueleto inicial: estrutura, esquema de dados ou primeiros exemplos, guias de contribuição em oito línguas.
