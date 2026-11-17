# Jó első feladatok

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · **Magyar**

- [ ] Anyanyelvi beszélőkkel átnézetni a 12 magyar promptot és a 10 fordítási promptot (RO→EN, EN→RO): megfogalmazás, referenciajegyzetek és a szólások kiválasztása
- [ ] A 22 kultúra-prompt tényeinek újraellenőrzése a forrásaikban, mindegyikhez egy második forrás hozzáadása, és az idővel változó tények megjelölése
- [ ] 20 román prompt hozzáadása a `law` kategóriához (alkotmányos alapfogalmak, fogyasztói jogok, szerződések), referenciajegyzetekkel és hivatalos forrásokkal
- [ ] 20 román prompt hozzáadása a `science` kategóriához (fizika, kémia, biológia, matematika), ellenőrzött referenciaválaszokkal
- [ ] `creative` promptok hozzáadása (rövid szöveg, rím, stílusréteg), amelyek referenciajegyzetei egyértelmű értékelési szempontokat adnak, és nem kérik védett művek reprodukálását
- [ ] `code` promptok hozzáadása (rövid Python- és JavaScript-feladatok román megjegyzésekkel), amelyek referenciajegyzetei tartalmaznak a választ ellenőrző tesztet
- [ ] Francia, német, olasz, spanyol vagy portugál promptkészletek hozzáadása a megfelelő kategóriákhoz (a felület és a séma már elfogadja ezeket a nyelveket)
- [ ] A `scripts/agreement.py` megírása: ha ketten ugyanazokra a párokra szavaznak, jelentse az egyezésüket (Cohen-kappa) és azokat a párokat, ahol eltérnek, tesztekkel egy kis példán
- [ ] Segédszkript írása, amely egy helyi modellfuttató kimenetét `answers.jsonl` fájllá alakítja (nincs API-kulcs a tárolóban, nincs hálózati hívás az oldalról)
- [ ] A `src/engine.mjs` és a `scripts/rank.py` kiegészítése promptok feletti bootstrappel (nemcsak a szavazatok felettivel), mindkét intervallum megjelenítése az eredményekben, és annak tesztelése, hogy a két program egyezik

Hozd létre mindet GitHubon a `scripts/create_issues.sh` szkripttel (a `gh` CLI szükséges).
