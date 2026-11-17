# Boas primeiras tarefas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · **Português** · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Pedir a falantes nativos que revejam os 12 prompts em húngaro e os 10 prompts de tradução (RO→EN, EN→RO): formulações, notas de referência e escolha das expressões idiomáticas
- [ ] Voltar a verificar os factos dos 22 prompts de cultura nas suas fontes, acrescentar uma segunda fonte a cada um e assinalar os factos que podem mudar com o tempo
- [ ] Acrescentar 20 prompts em romeno para a categoria `law` (noções constitucionais, direitos do consumidor, contratos), com notas de referência e fontes oficiais
- [ ] Acrescentar 20 prompts em romeno para a categoria `science` (física, química, biologia, matemática), com respostas de referência verificadas
- [ ] Acrescentar prompts `creative` (texto curto, rima, registo) cujas notas de referência deem critérios de avaliação claros e que não peçam a reprodução de obras protegidas
- [ ] Acrescentar prompts `code` (tarefas curtas em Python e JavaScript, com comentários em romeno) cujas notas de referência incluam um teste que verifique a resposta
- [ ] Acrescentar conjuntos de prompts em francês, alemão, italiano, espanhol ou português para as categorias adequadas (a interface e o esquema já aceitam estes idiomas)
- [ ] Escrever `scripts/agreement.py`: quando duas pessoas votam os mesmos pares, indicar a sua concordância (kappa de Cohen) e os pares em que divergem, com testes sobre um pequeno exemplo
- [ ] Escrever um script auxiliar que converta a saída de um executor local de modelos em `answers.jsonl` (sem chaves de API no repositório, sem chamadas de rede a partir da página)
- [ ] Acrescentar a `src/engine.mjs` e a `scripts/rank.py` um bootstrap sobre os prompts (e não apenas sobre os votos), mostrar os dois intervalos nos resultados e testar que os dois programas concordam

Cria-as todas no GitHub com `scripts/create_issues.sh` (requer a CLI `gh`).
