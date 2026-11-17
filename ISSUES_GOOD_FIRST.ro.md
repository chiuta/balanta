# Sarcini bune pentru început

[English](ISSUES_GOOD_FIRST.md) · **Română** · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Cere vorbitorilor nativi să revizuiască cele 12 prompturi în maghiară și cele 10 prompturi de traducere (RO→EN, EN→RO): formulări, note de referință și alegerea expresiilor idiomatice
- [ ] Reverifică faptele celor 22 de prompturi de cultură în sursele lor, adaugă o a doua sursă fiecăruia și marchează faptele care se pot schimba în timp
- [ ] Adaugă 20 de prompturi în română pentru categoria `law` (noțiuni constituționale, drepturile consumatorului, contracte), cu note de referință și surse oficiale
- [ ] Adaugă 20 de prompturi în română pentru categoria `science` (fizică, chimie, biologie, matematică), cu răspunsuri de referință verificate
- [ ] Adaugă prompturi `creative` (text scurt, rimă, registru) ale căror note de referință dau criterii clare de apreciere și care nu cer reproducerea unor opere protejate
- [ ] Adaugă prompturi `code` (sarcini scurte în Python și JavaScript, cu comentarii în română) ale căror note de referință includ un test care verifică răspunsul
- [ ] Adaugă seturi de prompturi în franceză, germană, italiană, spaniolă sau portugheză pentru categoriile potrivite (interfața și schema acceptă deja aceste limbi)
- [ ] Scrie `scripts/agreement.py`: când două persoane votează aceleași perechi, raportează acordul lor (kappa Cohen) și perechile în care diferă, cu teste pe un exemplu mic
- [ ] Scrie un script ajutător care transformă ieșirea unui executor local de modele în `answers.jsonl` (fără chei API în depozit, fără apeluri de rețea din pagină)
- [ ] Adaugă în `src/engine.mjs` și în `scripts/rank.py` un bootstrap peste prompturi (nu doar peste voturi), arată ambele intervale în rezultate și testează că cele două programe sunt de acord

Creează-le pe toate pe GitHub cu `scripts/create_issues.sh` (cere CLI-ul `gh`).
