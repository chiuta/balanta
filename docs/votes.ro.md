# BALANTA — formatul voturilor și algoritmii

[English](votes.md) · **Română**

Versiune: 0.2.0 · Ultima actualizare: 2026-11-17

Pagina descrie cele două fișiere pe care aplicația le citește și le scrie, calculele din spatele clasamentului, felul în care sunt trase perechile la orb și lista de verificare pentru prompturi noi. Clasamentul este implementat de două ori, în `src/engine.mjs` și în `scripts/rank.py`, iar testele verifică dacă cele două sunt de acord la 1e-6; astfel oricine poate recalcula un tabel publicat pornind de la `votes.jsonl`.

## 1. `votes.jsonl`

[JSON Lines](https://jsonlines.org/): text UTF-8, un obiect JSON pe rând, fără virgule între rânduri. Rândurile goale și cele care încep cu `#` se ignoră, deci poți lăsa note în fișier.

```jsonl votes
{"v":1,"prompt":"ro-grammar-0001","a":"model-1","b":"model-2","winner":"a","t":"2026-11-17T09:30:12Z"}
{"v":1,"prompt":"ro-grammar-0001","a":"model-3","b":"model-1","winner":"tie"}
{"v":1,"prompt":"ro-culture-0002","a":"model-2","b":"model-3","winner":"bad","t":"2026-11-17"}
```

| Câmp | Obligatoriu | Sens |
|---|---|---|
| `v` | nu | Versiunea formatului. Dacă există, trebuie să fie `1`; aplicația o scrie întotdeauna. |
| `prompt` | da | Id-ul promptului: 1–80 de caractere din `A–Z a–z 0–9 . _ : -`. Pentru prompturile incluse este numele fișierului fără `.json` (`ro-grammar-0001`); prompturile tale sunt `custom-1`, `custom-2`, … |
| `a`, `b` | da | Numele celor două modele: 1–40 de caractere, fără spațiu la început sau la sfârșit, fără caractere de control, iar `a` ≠ `b`. `a` este modelul afișat ca A (stânga), `b` cel afișat ca B (dreapta). |
| `winner` | da | `a`, `b`, `tie` sau `bad` (ambele răspunsuri au fost slabe: votul se păstrează și se numără pe model, dar nu mișcă clasamentul). |
| `t` | nu | O dată (`2026-11-17`) sau o dată cu oră (`2026-11-17T09:30:12Z`). |

Aplicația scrie cheile în ordinea de mai sus. Reguli de citire:

- Doar Elo depinde de ordinea rândurilor (este secvențial). Bradley–Terry, intervalele și toate celelalte numere nu depind.
- La importul voturilor, un rând identic cu unul deja existent (același `prompt`, `a`, `b`, `winner` și `t`) este sărit ca duplicat. Rândurile care diferă prin orice câmp, inclusiv `t`, sunt voturi diferite, deci aceeași pereche judecată de două persoane se numără de două ori.
- Un fișier are cel mult 200.000 de voturi; citirea se oprește la primul rând peste limită.
- Numele modelelor sunt text liber. Folosește numele exact și versiunea testată (`model-x 2026-10`) și aceeași scriere pe fiecare rând: `Model-X` și `model-x` sunt două modele.

Coduri de eroare, așa cum apar la import (`rank.py` le tipărește pe primele 20 la ieșirea de erori):

| Cod | Rândul… |
|---|---|
| `json` | nu este JSON valid |
| `object` | este JSON, dar nu un obiect |
| `version` | are un `v` diferit de `1` |
| `prompt` | nu are `prompt` sau are unul care nu este un id valid |
| `model` | nu are `a` ori `b` sau are un nume nevalid |
| `same` | are același model în ambele părți |
| `winner` | are un `winner` altul decât `a`, `b`, `tie`, `bad` |
| `time` | are un `t` care nu este o dată sau o dată cu oră |
| `many` | depășește limita de 200.000 de voturi (citirea se oprește) |

## 2. `answers.jsonl`

Un rând pe răspuns. Fișierul e doar o comoditate pentru a muta răspunsurile lipite între browsere sau între persoane; clasamentul nu are nevoie de el.

```jsonl answers
{"prompt":"ro-grammar-0001","model":"model-1","answer":"The text of the answer, exactly as the model wrote it."}
```

- `prompt` și `model` urmează aceleași reguli ca mai sus; `answer` este text nevid de cel mult 20.000 de caractere. Coduri de eroare: `json`, `object`, `prompt`, `model`, `answer` (lipsă sau goală), `long` (peste 20.000 de caractere).
- Importul completează răspunsurile modelelor și prompturilor care există deja în sesiune; rândurile despre alte modele sau prompturi sunt sărite și numărate. Un răspuns importat îl înlocuiește pe cel scris pentru același prompt și model.
- Exportul conține textul original al răspunsurilor, nu textul anonimizat afișat în timpul votului.

## 3. Cum merge o sesiune la orb

1. **Perechi.** Pentru fiecare prompt, fiecare pereche de modele care au ambele un răspuns este o comparație, trasă o singură dată. Ordinea comparațiilor și modelul afișat ca A depind numai de sămânță: cheia unei comparații este hash-ul FNV-1a pe 32 de biți al șirului `sămânță|id prompt|primul nume|al doilea nume`, cu cele două nume în ordine alfabetică (ordinea codurilor de caracter, deci cea obișnuită pentru nume ASCII simple). Comparațiile se sortează după această cheie (apoi după id-ul promptului); dacă cheia e impară, primul nume din această ordine este afișat ca A, altfel ca B. Aceeași sămânță dă mereu aceeași succesiune, iar lipirea unui răspuns nou nu amestecă din nou comparațiile care există deja.
2. **Anonimizare.** În timp ce votezi, numele modelelor scrise în pregătire, plus o listă încorporată de nume cunoscute (ChatGPT, GPT, OpenAI, Claude, Anthropic, Gemini, Llama, Mistral, Qwen, DeepSeek, Grok, …), sunt înlocuite cu `[model]` în răspunsuri (cuvinte întregi, indiferent de litere mari sau mici). E un efort de bună-credință: stilul, formatarea și expresiile preferate pot da un model de gol, iar un nume pe care nu l-ai trecut poate scăpa; dacă sursa contează, citește textul răspunsului înainte să-l lipești.
3. **Vot.** `A`, `B`, egal sau ambele slabe (tastele 1–4). `S` sare peste: comparația trece la coada cozii și nu se înregistrează nimic. Anularea scoate doar ultimul vot. Aplicația poate arăta numele modelelor după fiecare vot (opțiune, oprită implicit).

## 4. Calculele

Se numără doar voturile cu `winner` ≠ `bad`. O remiză înseamnă jumătate de victorie pentru fiecare parte.

**Bradley–Terry (scorul principal).** Fiecare model `i` are o putere `p_i`, iar șansa ca `i` să îl învingă pe `j` este `p_i / (p_i + p_j)`. Puterile se află cu algoritmul de minorizare–maximizare (Hunter, 2004):

```
p_i  ←  (W_i + 0.5) / ( 1/(p_i + 1)  +  Σ_j  n_ij / (p_i + p_j) )
rating_i = 1000 + 400 · log10(p_i)
```

`W_i` este numărul de victorii ale lui `i` (remizele numără 0,5), iar `n_ij` numărul de voturi numărate dintre `i` și `j`. Termenii în plus sunt un **adversar virtual** de putere 1 (scor 1000) cu care fiecare model joacă o dată și face remiză; fără el, un model care nu a pierdut niciodată (sau nu a câștigat niciodată) ar primi o putere infinită (sau zero). Iterația pornește de la `p = 1` și se oprește când niciun `ln p_i` nu se mai schimbă cu mai mult de 1e-12 (cel mult 20.000 de runde). Adversarul virtual fixează scara, deci compară între ele rândurile unui singur tabel; nu compara numere luate din tabele diferite.

**Elo.** Voturile se prelucrează în ordinea din fișier, pornind de la 1000, cu K = 32. Pentru `A` contra `B`: `expected_A = 1 / (1 + 10^((R_B − R_A) / 400))` și `R_A ← R_A + 32 · (score_A − expected_A)`, cu aceeași schimbare în sens opus pentru `B`. Elo este arătat pentru că e cunoscut; depinde de ordinea voturilor, deci numărul de folosit este Bradley–Terry.

**Interval de 95% (bootstrap).** Voturile numărate se trag cu revenire, în număr egal cu cele existente, și Bradley–Terry se calculează din nou; se repetă de 200 de ori (60 în aplicație când sunt peste 3.000 de voturi) cu generatorul `mulberry32` și sămânța 1, deci rezultatul se poate reproduce. Intervalul este de la percentila 2,5 la percentila 97,5 a celor 200 de scoruri (valoarea de pe poziția `floor(q · (n − 1) + 0.5)` din lista sortată). Un model care apare în mai puțin de 20 dintre eșantioane nu primește interval. Dacă două intervale se suprapun, voturile nu despart cele două modele.

**Celelalte coloane.** Rata de victorii = (victorii + ½ remize) / voturile numărate ale modelului. *Ambele slabe* = voturile marcate `bad` la care participă modelul. *Influența poziției* = ponderea voturilor decise (fără remize, fără `bad`) câștigate de modelul afișat ca A; cu o atribuire A/B aleatorie se așteaptă cam 50%, iar o abatere mare înseamnă că votantul preferă o parte.

## 5. Cum se citesc numerele

- Sub aproximativ 30 de voturi numărate aplicația avertizează că clasamentul e nesigur: intervalele sunt foarte largi.
- Rezultatul e valabil pentru prompturile folosite, în limba lor, cu versiunile și setările modelelor pe care le-ai lipit. Notează-le: fac parte din rezultat.
- Un votant este o singură părere. Pentru un test comun, unește fișierele mai multor votanți (importul sare duplicatele exacte) și rulează `rank.py` pe fișierul unit; măsurarea cât de des sunt de acord votanții este o sarcină deschisă.
- Bradley–Terry presupune o singură putere pe model. Tabelele pe categorii și pe limbi arată unde nu se potrivește: un model poate câștiga la gramatică și pierde la cultură.
- Prompturile incluse au fost redactate cu un asistent de IA. Prompturile în maghiară și cele de traducere sunt scrise automat și cer revizuire de către vorbitori nativi; faptele din prompturile de cultură au fost verificate în paginile citate la momentul scrierii, iar paginile se pot schimba.

## 6. Lista de verificare a calității prompturilor

Aplicația rulează partea automată a acestei liste pe prompturile tale înainte să le poți exporta, iar testele o rulează pe fiecare prompt inclus.

| Verificare | Cod | În aplicație |
|---|---|---|
| Fără adresă de e-mail | `email` | blochează |
| Fără număr de telefon românesc (național sau internațional) | `phone` | blochează |
| Fără cod numeric personal (CNP) | `cnp` | blochează |
| Fără IBAN | `iban` | blochează |
| Fără caractere de control (rândurile noi și tab-urile sunt permise) | `ctrl` | blochează |
| Cel mult 4.000 de caractere | `long` | blochează |
| Cel puțin 12 caractere | `short` | blochează |
| Fără pasaj citat de 300 de caractere sau mai mult (text copiat) | `quote` | blochează |
| Româna scrisă cu `ș ț` cu virgulă, nu cu sedilă `ş ţ` | `cedilla` | avertizează |
| Textul românesc de 80 de caractere sau mai mult este scris cu diacritice (`ă â î ș ț`) | `diacritics` | avertizează |
| `culture`: note de referință și cel puțin o sursă `https` | `notes`, `sources` | blochează |

Aceste verificări nu înlocuiesc judecata. Verifică și manual că: există un singur răspuns corect clar sau criterii clare; întrebarea poate primi răspuns fără să deschizi un link; fiecare fapt a fost verificat într-o sursă, iar faptele care se pot schimba în timp spun asta; `difficulty` este sinceră; iar textul nu descrie o persoană privată.

## 7. Verificarea unui fișier

```
python scripts/rank.py votes.jsonl [--k 32] [--rounds 200] [--seed 1] [--no-ci] [--json]
```

Cere doar Python 3, tipărește același tabel ca aplicația (loc, model, Bradley–Terry, interval, Elo, rata de victorii, jocuri, voturi slabe, influența poziției) sau tot rezumatul ca JSON, listează primele rânduri greșite la ieșirea de erori și iese cu starea 2 când nu există niciun vot valid. Pentru că ambele programe folosesc același generator și aceeași rotunjire, numerele coincid cu cele din aplicație.
