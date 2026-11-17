# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.2.0 · Última atualização: 2026-11-17

🌐 https://balanta.chiuta.ro

> Avaliação cega e lado a lado de modelos de IA em romeno — prompts e votos abertos.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa, utilizável: o único `index.html` compara modelos de IA às cegas, offline e sem servidor. Cola as respostas de dois a oito modelos aos 92 prompts incluídos (romeno, inglês, húngaro) ou aos seus, vota A ou B sem ver os nomes dos modelos e obtém uma classificação Bradley–Terry e Elo com intervalos de confiança, uma página de resultados estática e um ficheiro `votes.jsonl` que qualquer pessoa pode recalcular com `scripts/rank.py`. Nada é enviado e nenhum modelo é chamado.

## O que faz

- Inclui 92 prompts como ficheiros de dados: gramática romena (30), cultura e história com fontes (20), raciocínio (20), tradução RO→EN e EN→RO (10) e um conjunto em húngaro (12). Cada prompt tem notas de referência.
- Votação às cegas: cola a resposta de cada modelo, a aplicação oculta os nomes dos modelos dentro das respostas («[model]»), fixa a ordem e os lados A/B a partir de uma semente e regista A, B, empate ou ambas ruins (teclas 1–4, anular, revelação opcional após cada voto).
- Classificação: Bradley–Terry (a pontuação principal) e Elo, intervalos bootstrap de 95%, percentagem de vitórias, percentagem de «ambas ruins», influência da posição, frente a frente, ordem por categoria e por idioma, filtros.
- Formatos abertos: `votes.jsonl` e `answers.jsonl` (JSON Lines, descritos em `docs/votes.md`), importação que ignora os duplicados e nomeia as linhas erradas, `scripts/rank.py` que recalcula a mesma tabela sem bibliotecas, uma página de resultados estática e uma tabela Markdown.
- Os seus próprios prompts, verificados automaticamente (e-mail, telefone, CNP, IBAN, citações longas, diacríticos romenos) e exportados como ficheiro JSON pronto para um pull request; interface em oito idiomas, temas escuro e claro, teclado, funciona desde 360 px de largura; os dados ficam no navegador, sem rede, sem rastreamento.
- Instalável como aplicação e disponível offline após a primeira visita quando servida por HTTPS (um service worker guarda a página; nada mais é guardado ou enviado). Aberta a partir de um ficheiro descarregado funciona da mesma forma, sem instalação.

## Como funciona

- Um ficheiro JSON por prompt em `data/prompts/`, verificado por `schema.json`; `docs/votes.md` (e `docs/votes.ro.md`) descreve o formato dos votos, os algoritmos e a lista de verificação da qualidade dos prompts.
- `src/engine.mjs` é o motor (sem ecrã, sem rede): formato dos votos, Elo, Bradley–Terry (com um adversário virtual de ancoragem, para que os modelos invictos ou sem vitórias obtenham pontuações finitas), bootstrap, emparelhamentos a partir de um hash da semente, anonimização, verificação dos prompts e exportações. `scripts/rank.py` refaz a mesma aritmética em Python sem bibliotecas; os testes comparam ambos a 1e-6.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` são a interface; `node scripts/build.mjs` constrói o único `index.html` (`--check` verifica que coincide).
- `npm test` executa os testes do motor, dos ficheiros de dados e dos textos da interface; `python scripts/validate.py` verifica os ficheiros JSON; os testes de navegador estão no hub. O desenvolvimento requer Node.js 24 ou mais recente; a página em si só precisa de um navegador que conheça ES2017.
- `manifest.webmanifest`, `sw.js` e os ícones são produzidos por `node scripts/build.mjs` através do kit comum (secção `pwa` de `src/app.json`); `--check` também os verifica, e `npm test` confirma que o manifesto, a versão do service worker e a CSP correspondem à página.

## Limites e o que não faz

- Não chama nenhum modelo: as respostas é você quem as cola. Não há chaves de API, contas nem servidores.
- A votação às cegas vale o que vale a anonimização: a aplicação oculta os nomes de modelos conhecidos, mas o estilo de uma resposta pode ainda assim denunciar o autor.
- A classificação reflete as preferências de quem vota nos prompts escolhidos; com poucos votos ou poucos prompts não diz nada de geral sobre os modelos.
- Os prompts incluídos foram redigidos com um assistente de IA; os em húngaro e os de tradução aguardam em especial a revisão de falantes nativos. Os factos de “cultura” têm fontes, mas podem ficar desatualizados.
- O Elo depende da ordem dos votos; o Bradley–Terry não. Os intervalos são aproximados (bootstrap sobre os votos, não sobre os prompts).
- Os dados ficam no localStorage (cerca de 5 MB por site): em sessões grandes, exporte regularmente votes.jsonl e answers.jsonl.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/prompts/example.json` para `data/prompts/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.
5. Para alterar o motor ou a interface, edite `src/` e execute `npm test` e `node scripts/build.mjs` (veja `CONTRIBUTING.md`).

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
