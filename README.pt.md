# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.1.0 · Última atualização: 2026-11-14

🌐 https://balanta.chiuta.ro

> Avaliação cega e lado a lado de modelos de IA em romeno — prompts e votos abertos.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa: o repositório contém a estrutura, o esquema de dados ou os primeiros exemplos e os guias de contribuição. O âmbito abaixo é o plano, não o que funciona hoje.

## Âmbito previsto

- Conjuntos de prompts em romeno: 30 de gramática (sinais diacríticos, `s-au/sau`, `i-a/ia`, translineação), 20 de cultura e história com notas de referência e fontes, 20 de raciocínio e 10 de tradução RO↔EN com expressões idiomáticas.
- Um conjunto de prompts em húngaro (lang hu) para utilizadores da Transilvânia.
- Um formato de exportação de votos (`votes.jsonl`) e classificação Bradley–Terry / Elo em `scripts/rank.py`.
- Anonimização: nomes de modelos retirados das respostas mostradas, e uma lista de verificação da qualidade dos prompts (sem dados pessoais, sem texto protegido).
- Um gerador de página estática de resultados.

Nada disto está ainda implementado: cada ponto é uma tarefa preparada em `ISSUES_GOOD_FIRST.md`.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/prompts/example.json` para `data/prompts/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
