# Mikroreže & BESS

:material-arrow-right: **Završni rad (prvi ciklus):** Modeliranje i simulacija sistema vođenja mikromreze u Typhoon HIL okruženju — detaljno u nastavku.

---

## Završni rad — sistem vođenja mikromreze u Typhoon HIL okruženju

**Elektrotehnički fakultet u Sarajevu** · Odsjek za automatiku i elektroniku · mentor: v. prof. dr Senad Huseinbegović · juli 2026.

!!! abstract "U jednoj rečenici"
    Na **Typhoon HIL 402** emulatoru u realnom vremenu izmodelirana je mikromreža (PV + BESS + potrošači + mreža), a **rule-based EMS algoritam napisan u C-u** pokretan je na eksternom **Raspberry Pi 5** kontroleru i testiran kroz mrežni i izolovani režim rada.

### Problem

Mikromreža mora istovremeno zadovoljiti dva cilja koji su u konfliktu: **ekonomsku optimizaciju** razmjene energije s distributerom (tarife, vršna opterećenja) i **pouzdanost napajanja** kritičnih potrošača kada mreža nestane. Upravljački sloj zato mora u realnom vremenu donositi odluke o punjenju/praznjenju baterije, rasterećenju potrošača i prelasku u ostrvski rad — pri čemu prelazni procesi neposredno ugrožavaju napon i frekvenciju lokalnog sistema.

Zadatak je bio: modelirati mikromrežu, projektovati algoritam vođenja i **verifikovati ga u realnom vremenu na hardverskom simulatoru**, a ne samo u simulaciji na papiru.

### Modelirani sistem

<svg viewBox="0 0 900 330" role="img" aria-label="Topologija mikromreže i upravljačka petlja" style="width:100%;height:auto;font-family:inherit;font-size:14px">
  <style>
    .box{fill:currentColor;fill-opacity:.06;stroke:currentColor;stroke-opacity:.45;stroke-width:1.5}
    .txt{fill:currentColor}
    .sm{font-size:11.5px;opacity:.72}
    .ln{stroke:currentColor;stroke-opacity:.55;stroke-width:1.8;fill:none}
    .dash{stroke:currentColor;stroke-opacity:.45;stroke-width:1.4;stroke-dasharray:5 4;fill:none}
  </style>
  <text class="txt" x="20" y="24" style="font-size:12px;opacity:.65;letter-spacing:.06em">ENERGETSKI DIO (HIL 402, realno vrijeme)</text>

  <rect class="box" x="20" y="38" width="150" height="56" rx="6"/>
  <text class="txt" x="95" y="62" text-anchor="middle">Distributivna</text>
  <text class="txt" x="95" y="78" text-anchor="middle">mreža</text>
  <text class="txt sm" x="95" y="112" text-anchor="middle">0,4 kV · 50 Hz · ToU tarifa</text>

  <rect class="box" x="215" y="38" width="130" height="56" rx="6"/>
  <text class="txt" x="280" y="62" text-anchor="middle">MCB / STS</text>
  <text class="txt sm" x="280" y="78" text-anchor="middle">prekidač mreže</text>

  <line class="ln" x1="170" y1="66" x2="215" y2="66"/>

  <line class="ln" x1="345" y1="66" x2="880" y2="66"/>
  <text class="txt sm" x="600" y="58" text-anchor="middle">AC sabirnica mikromreže (PCC)</text>

  <line class="ln" x1="430" y1="66" x2="430" y2="108"/>
  <rect class="box" x="365" y="108" width="130" height="52" rx="6"/>
  <text class="txt" x="430" y="130" text-anchor="middle">PV elektrana</text>
  <text class="txt sm" x="430" y="146" text-anchor="middle">20 kW</text>

  <line class="ln" x1="535" y1="66" x2="535" y2="108"/>
  <rect class="box" x="465" y="108" width="140" height="52" rx="6"/>
  <text class="txt" x="535" y="130" text-anchor="middle">BESS</text>
  <text class="txt sm" x="535" y="146" text-anchor="middle">5 kW · 72,8 Ah</text>

  <line class="ln" x1="650" y1="66" x2="650" y2="108"/>
  <rect class="box" x="585" y="108" width="130" height="52" rx="6"/>
  <text class="txt" x="650" y="130" text-anchor="middle">Potrošači</text>
  <text class="txt sm" x="650" y="146" text-anchor="middle">43,51 kW</text>

  <line class="ln" x1="775" y1="66" x2="775" y2="108"/>
  <rect class="box" x="710" y="108" width="130" height="52" rx="6"/>
  <text class="txt" x="775" y="130" text-anchor="middle">Prioritet</text>
  <text class="txt sm" x="775" y="146" text-anchor="middle">5 kW</text>

  <line class="dash" x1="95" y1="94" x2="95" y2="228"/>
  <line class="dash" x1="535" y1="160" x2="535" y2="228"/>
  <line class="dash" x1="650" y1="160" x2="650" y2="228"/>
  <line class="dash" x1="280" y1="94" x2="280" y2="228"/>

  <text class="txt" x="20" y="222" style="font-size:12px;opacity:.65;letter-spacing:.06em">UPRAVLJAČKI DIO (van simulatora)</text>

  <rect class="box" x="20" y="232" width="860" height="72" rx="6"/>
  <text class="txt" x="40" y="260">Raspberry Pi 5 — rule-based EMS u jeziku C</text>
  <text class="txt sm" x="40" y="282">8 pravila (Cond1–Cond8) · uzorkovanje T₁ = 1 ms · slanje T₂ = 1 ms · zatvorena petlja T<sub>C</sub> = 2 ms</text>

  <line class="dash" x1="450" y1="232" x2="450" y2="196"/>
  <text class="txt sm" x="462" y="205">ETH VE (TCP/UDP, lwIP, bare-metal na HIL-u)</text>
</svg>

_Parametri modela su definisani na osnovu realnih troodnevnih mjerenja sa Elektrotehničkog fakulteta u Sarajevu._

### Komponente i parametri modela

| Komponenta | Nominalno | Ograničenja u modelu | Napomena |
| --- | --- | --- | --- |
| **BESS** | 5 kW, 72,8 Ah | SoC 30 – 90 %, rampa 0,5 p.u./s, ±1 p.u. punjenje/pražnjenje | grid-forming u izolovanom režimu |
| **PV elektrana** | 20 kW | rampa 1 p.u./s | profil proizvodnje po danima |
| **Distributivna mreža** | 0,4 kV, 50 Hz | ToU tarifa f(t) | slack čvor u mrežnom režimu |
| **Potrošači** | 43,51 kW | prioritetni dio 5 kW | RLC model, MCB za odvajanje |

### Alati i hardver

| Sloj | Platforma |
| --- | --- |
| Real-time simulacija | Typhoon HIL 402, HIL Control Center, Schematic Editor, HIL SCADA |
| Kontroler | Raspberry Pi 5, upravljački kod u **C**, bare-metal komunikacija |
| Komunikacija | **ETH VE** (Ethernet Variable Exchange) — TCP/UDP uz lwIP biblioteku, ETH VE Setup / Send / Receive blokovi |
| Modelovanje | Modularni blokovi BESS / PV / Grid / Load (Power Stage + Control Stage) |

Brojne vrijednosti iz simulacije:

$$
T_S = 20\ \mu s,\qquad T_1 = 1\ \text{ms},\qquad T_2 = 1\ \text{ms},\qquad T_C = T_1 + T_2 = 2\ \text{ms}
$$

Korak simulacije je fiksan, diskretizacija diferencijalnih jednačina vršena je **bilinearne (Tustinove) transformacije**, a rješavanje DAE sistema metodom pogodnim za model s promjenjivom topologijom (zbog prekidačkih elemenata).

### EMS: rule-based algoritam sa osam pravila

Kontroler u svakom ciklusu prikuplja mjerne veličine (napon, frekvencija, status mreže, SoC, snage svih komponenti) i prema logici odlučivanja šalje referencu snage BESS-a, komande prekidačima i signal za rasterećenje.

| Pravilo | Uslov | Djelovanje |
| --- | --- | --- |
| **Cond1** | tarifa distributera < referentna tarifa | jeftina energija → punjenje BESS-a |
| **Cond2** | *P*<sub>razlika</sub> = *P*<sub>potrošači</sub> − *P*<sub>izvori</sub> < 0 | suficit proizvodnje → punjenje BESS-a |
| **Cond3** | pokretni prosjek cijene > granice u intervalu *N*/h | ekonomski uslov za punjenje |
| **Cond4** | *V*<sub>meas</sub> ∉ [0,9; 1,1]·*V*<sub>nom</sub> ∨ *f*<sub>meas</sub> ∉ [0,99; 1,01]·*f*<sub>nom</sub> | mreža odspojena → **islanded** |
| **Cond5** | napon i frekvencija u granicama, mreža priključena | **rekonekcija** na distributivnu mrežu |
| **Cond6** | mreža odspojena | rasterećenje standardnih potrošača, zadržava se prioritet |
| **Cond7** | *P*<sub>razlika</sub> > *P*<sub>punjenje,max</sub> | ograničavanje izvora / odspajanje dijela izvora |
| **Cond8** | SoC[*n*] ≤ SoC<sub>min</sub> | prisilno punjenje do SoC<sub>rec</sub> (histereza) |

Kritično stanje (Cond8) ima prioritet nad svim ostalim pravilima — algoritam blokira pražnjenje i prisilno puni bateriju uz histerezu, pa se tek nakon oporavka SoC-a vraća ekonomskim pravilima.

### Testni scenariji i rezultati

**Mrežni režim (Grid-connected):**

- Vođenje po tarifi (ToU) uz **Peak Clipping** i **Valley Filling** — BESS puni jeftinu i prazni skupu energiju.
- Punjenje suficitom proizvodnje iz PV-a (Cond2).
- „Eco" punjenje na ciljnom nivou SoC: **80 %** u punijem, odnosno **60 %** u konzervativnijem scenariju.

**Izolovani režim (Islanded):**

- Mrežni kvar → STS prekidač uspješno izoluje mikromrežu na PCC-u, a BESS preuzima formiranje mreže.
- Algoritam aktivira Cond6 i provodi **load shedding**: standardni potrošači se isključuju, prioritetni dio od 5 kW ostaje napajan, bez rizika od potpunog gasenja.
- **Napon je ostao unutar granica [0,9; 1,1]·V<sub>nom</sub>, a frekvencija unutar [0,99; 1,01]·f<sub>nom</sub>** tokom prelaznog procesa.

**Rekonekcija:** BESS glatko prelazi iz grid-forming u grid-following režim i vraća se primarnoj funkciji optimizacije tokova po tarifi.

!!! success "Glavni dokaz"
    HIL simulacija u realnom vremenu potvrdila je potpunu usklađenost između teorijski postavljenih pravila i stvarnog odziva modela na HIL 402, pri čemu ETH VE obezbjeđuje razmjenu podataka s minimalnim i predvidivim kašnjenjima.

### Ograničenja (kako su navedena u radu)

- Model se oslanja na **koncentrisane modele** komponenti jer realno-vremenska ograničenja HIL platforme ne dozvoljavaju kompleksne prelazne pojave u električnim mašinama.
- Rule-based pristup je efikasan i predvidiv, ali **ne uči i ne adaptira** se na drastično izmijenjenu topologiju bez ručne rekonfiguracije.
- Kašnjenja Ethernet komunikacije su zanemarena zbog visoke brzine kontrolera.

### Smjer budućeg rada

Naprednije metode upravljanja — **MPC** (Model Predictive Control) i algoritmi zasnovani na vještačkoj inteligenciji — radi veće energetske efikasnosti i otpornosti na nepredviđene poremećaje.

!!! info "Materijali"
    PDF završnog rada: `Data/Zavrsni_Krdzalic.pdf` (van repozitorija portfolija). Video snimci HIL testa i SCADA paneli dostupni lokalno.

---

## Boost pretvarač za punjenje 18650 paketa

**Predmet:** Energetski pretvarači · tim: Anesa Bajramović, Emir Krdžalić · juni 2026.

!!! abstract "U jednoj rečenici"
    Projektovan je **boost DC/DC pretvarač** (24 V → 54,6 V, 20 kHz) za punjenje **13S4P paketa** od 52 × 18650 ćelija (48 V / 10 Ah) po **CC-CV** profilu — proračun L i C iz uslova vala struje, izvođenje **state-space modela u ON i OFF stanju**, usrednjavanje i prenosna funkcija, a odziv je verifikovan u **MATLAB**-u (skripte `T1.m`–`T4.m`).

### Baterijski paket

| Parametar | Vrijednost |
| --- | --- |
| Ćelija | **18650**, 2 500 mAh |
| Konfiguracija | **13S4P** → 52 ćelije |
| Nominalni napon / kapacitet | **48 V / 10 Ah** |
| Struja punjenja (1C) | **10 A** |
| Profil punjenja | **CC-CV**, konstantni napon do **54,6 V** (13 × 4,2 V) |

### Proračun boost stepena

$$
D = 1-\frac{V_{in}}{V_{out}} = 1-\frac{24}{54{,}6} = 0{,}5604
$$

| Veličina | Vrijednost | Kako je dobiveno |
| --- | --- | --- |
| Radna frekvencija *f*<sub>s</sub> | **20 kHz** | zahtjev (izvan čujnog opsega) |
| Koeficijent punjenja *D* | **0,5604** | iz odnosa napona u CCM |
| Val struje induktiviteta Δ*I*<sub>L</sub> | **1,1375 A** | ~20 % struje induktiviteta |
| Induktivitet *L* | **0,59 mH** | *L = V*<sub>in</sub>*D*/(*f*<sub>s</sub>·Δ*I*<sub>L</sub>) |
| Kapacitet *C* | **1,4 mF** | iz dozvoljenog vala izlaznog napona |
| Ekvivalentno opterećenje *R* | **10,92 Ω** | *R = V*<sub>out</sub>²/*P*<sub>out</sub> |

### Model i simulacija

1. **ON stanje** (prekidač zatvoren): induktivitet se puni iz izvora, dioda blokira izlaz.
2. **OFF stanje** (prekidač otvoren): energija iz *L* prelazi u potrošač kroz diodu.
3. **Usrednjeni model** (average state-space) → linearizacija oko radne tačke → **prenosna funkcija** čiji je odziv na promjenu koeficijenta punjenja simuliran u MATLAB-u.
4. U MATLAB-u (`T1.m`–`T4.m`) generisani su odzivi struje induktiviteta i izlaznog napona na korak **Δ*D* = 0,05**, uz provjeru amplitude vala i vremenske konstante.

!!! info "Artefakti"
    `Data/Boost_charging/` — MATLAB skripte `T1.m`–`T4.m` i PDF seminarskog rada. Grafičke priloge **postoje samo u PDF-u** (PNG/JPG izvoz ne postoji u izvornom projektu), pa nisu preneseni na stranicu.
