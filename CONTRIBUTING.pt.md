# Como contribuir — BALANTA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · **Português** · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versão: 0.2.1 · Última atualização: 2026-11-20

1. Faça um fork deste repositório.
2. Copie `data/prompts/example.json` para `data/prompts/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Regras

- Uma entrada = um ficheiro.
- Cite sempre uma fonte.
- Contribua apenas com material que possa partilhar legalmente (sem texto protegido copiado).
- Seja gentil: veja o Código de Conduta.

## Acrescentar prompts e votos

1. Copie `data/prompts/example.json` para `data/prompts/<lang>-<category>-<NNNN>.json`: o nome do ficheiro é o `id`, com o próximo número livre do seu grupo (`ro-grammar-0031`).
2. Escreva o `prompt` no idioma indicado por `lang`, como uma pergunta completa a que se possa responder sem abrir uma ligação. Em `reference_notes` diga o que uma resposta correta deve conter, em uma ou duas frases. Para `culture` as notas e pelo menos uma fonte `https` são obrigatórias.
3. Lista de verificação da qualidade: sem dados pessoais (pessoas privadas, e-mail, telefone, CNP, IBAN); sem texto protegido copiado (parafraseie; a aplicação bloqueia uma passagem citada de 300 carateres ou mais); romeno com os diacríticos com vírgula (ș, ț), nunca com cedilha; uma única resposta correta clara ou critérios claros; cada facto verificado numa fonte, e os factos que podem mudar com o tempo assinalados como tal; uma `difficulty` honesta.
4. Execute `python scripts/validate.py` e `npm test`: os testes verificam o esquema, o id e a numeração, as notas e as fontes, as regras da lista de verificação e os duplicados.
5. Para contribuir com votos, exporte `votes.jsonl` da aplicação (formato em `docs/votes.md`), verifique-o com `python scripts/rank.py votes.jsonl` e anexe-o a uma issue ou a um pull request juntamente com `answers.jsonl` e os nomes exatos, versões e definições dos modelos; nunca inclua dados pessoais.
6. A revisão por falantes nativos dos prompts em húngaro e de tradução é muito bem-vinda: abra uma issue com o id e a correção proposta.
