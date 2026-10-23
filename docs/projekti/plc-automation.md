# PLC & Automatizacija

Projektovanje i programiranje industrijskih upravljačkih sistema: **Schneider** PLC + frekventni invertor + **HMI**, te primjena **dvopoložajne (on/off) regulacije** na programabilnom releju.

---

## Projektovanje elektro-energetskog i upravljačkog dijela postrojenja za regulaciju brzine asinhronog motora

**Predmet:** Industrijska automatizacija · mentor: doc. dr Nedim Osmić · ekspert: Hujdur Muhidin · asistent: Tarik Pozderac · 2025/26.
**Tim:** E. Krdžalić, S. Muratagić, A. Šabić · uloga: programiranje PLC–invertor komunikacije i HMI vizualizacije

!!! abstract "U jednoj rečenici"
    Kompletno postrojenje — **TM200CE24T** PLC, **ATV12H055M2** frekventni invertor i **HMISTU855** touch HMI — projektovano je od principijelne sheme i predračuna do Modbus komunikacije, drive funkcionalnih blokova i višekranskog HMI projekta sa upravljačkim grupama i lozinkama.

### Problem

Regulacija brzine asinhronog motora najčešće se radi frekventnim invertorom, ali sam invertor nije sistem — potrebno je definisati čitav napojni lanac (zaštita, razdvajanje, E-STOP), komunikaciju između PLC-a i invertora te operatersku vizualizaciju s hijerarhijom prava pristupa. Zadatak je bio projektovati **cio lanac**: elektro shema → hardver s predračunom → PLC logika → Modbus → HMI.

### Principijelna shema

![Principijelna shema postrojenja](../images/ia/principijelna-shema.png)

Napojni dio ide preko glavnog prekidača i osigurača na **ATV12** invertor, pa preko Kontaktdora **CA3SK20BD** na asinhroni motor; upravljački dio napaja se 24 V DC napajanjem zaštićenim **FID sklopkom (300 mA)**.

| Komponenta | Oznaka / model | Uloga |
| --- | --- | --- |
| PLC | **Schneider TM200CE24T** (Modicon M221) | glavni upravljački uređaj, Machine Expert Basic |
| Frekventni invertor | **Schneider ATV12H055M2** (1,5 kW / 230 V) | regulacija brzine, metoda **U/f = const** |
| HMI | **Schneider HMISTU855**, 5,7" touch | vizualizacija i upravljanje, Vijeo Designer |
| Komunikacija | **RJ45 / Modbus** (RS-485 serialni port invertora) | PLC → ATV12 reference i komande |
| Glavni kontaktor | **CA3SK20BD** | priključenje motora, upravljan iz PLC izlaza |
| Motor zaštita | **RSL1PRBU** termički relej | zaštita od preopterećenja |
| E-STOP | **Harmony XB5** (gribolica) | hitno zaustavljanje, hardverski lanac |
| Zaštita | osigurači **AC 10 A / AC 4 A / DC 2 A**, FID 300 mA | kratki spoj i dodir |
| Napajanje | 24 V DC | upravljački krug PLC-a, HMI-ja, invertora |

![ATV12 frekventni invertor](../images/ia/atv12-frekventni-invertor.jpg)
*ATV12H055M2 — podešavanje U/f karakteristike i Modbus adrese.*

![Modicon TM200 PLC](../images/ia/tm200-plc.jpg)
*TM200CE24T — 24 I/O tačke, ugrađeni Modbus port.*

![HMISTU855](../images/ia/hmistu855-hmi.jpg)
*HMISTU855, 5,7" rezistivni touch ekran.*

### Predračun (ukupno 2 824,10 KM)

| Stavka | Iznos (KM) |
| --- | --- |
| HMI HMISTU855 | 1 575,37 |
| PLC TM200CE24T | 604,55 |
| Invertor ATV12H055M2 | 460,30 |
| Kontaktor CA3SK20BD | 70,31 |
| Termorelej RSL1PRBU | 48,88 |
| FID sklopka 300 mA | 41,10 |
| Harmony XB5 (E-STOP) | 17,59 |
| Kabel i sitni materijal | 6,00 |

### PLC dio — Machine Expert Basic

Komunikacija s invertorom ide kroz **ATV drive funkcionalne blokove** koji Modbus registre kriju iza API-ja s enable/execute handshake-om:

| Blok | Zadatak |
| --- | --- |
| `MC_Power_ATV` | uključivanje snage invertora (enable) |
| `MC_Jog_ATV` | ručno pokretanje (jog) iz HMI-ja |
| `MC_MoveVel_ATV` | kretanje na zadanu brzinu (glavna komanda) |
| `MC_Stop_ATV` | kontrolirano zaustavljanje (rampa) |
| `MC_ReadStatus_ATV` | bitovi statusa (got, error, busy) |
| `MC_ReadMotionState_ATV` | stanje drive-a za HMI indikatore |
| `MC_Reset_ATV` | reset greške invertora |

```iecst
(* Glavna komanda: zadana brzina iz HMI-ja, smjer se bira flagom *)
MC_MoveVel_ATV(
    Axis       := ATV12,
    Execute    := hmi_Start AND NOT hmi_Stop AND NOT estop,
    Velocity   := hmi_ZadanaBrzina,          (* rpm, ograničeno na HMI strani *)
    Direction  := hmi_SmjerCW,               (* TRUE = CW, FALSE = CCW *)
    Profile    := ATVFwd_Vel
);

(* Povratna informacija za HMI i sigurnosni lanac *)
MC_ReadStatus_ATV(Axis := ATV12, Enable := TRUE);
hmi_Rad := MC_ReadStatus_ATV.IsMoving;
hmi_Greska := MC_ReadStatus_ATV.Error;
```

### HMI — Vijeo Designer

| Ekran | Sadržaj |
| --- | --- |
| **Glavni ekran** | zadana i trenutna brzina, START/STOP, izbor smjera CW/CCW, trend brzine |
| **500 RPM / 1500 RPM** | direktni presetovi brzine (jedan dodir) |
| **Promjena smjera** | CW/CCW uz prikaz trenutne brzine i vremena rada |
| **Login / Logout** | prijava, automatski logout poslije **1 min** neaktivnosti |
| **Historija događaja** | *Alarms & Events* log (Inspector i Admin mogu pregledati) |
| **Postavke** | Admin: jezik, zabrana promjene smjera, dodavanje korisnika |
| **Sigurnosne postavke** | E-STOP status i limit brzine |
| **Višejezičnost** | EN / BS, prebacivanje u runtimeu |

![Glavni HMI ekran](../images/ia/hmi-glavni_ekran.png)
*Glavni ekran: zadana vs. trenutna brzina, START/STOP i izbor smjera.*

![Brzina 500 o/min](../images/ia/hmi-500_rpm.png)
![Brzina 1500 o/min](../images/ia/hmi-1500_rpm.png)
![Promjena smjera](../images/ia/hmi-promjena_smjera.png)

![Login ekran](../images/ia/hmi-login.png)
![Historija događaja](../images/ia/hmi-historija.png)

![Postavke](../images/ia/hmi-postavke.png)
![Sigurnosne postavke](../images/ia/hmi-sigurnosne_postavke.png)

![Hitni stop](../images/ia/hmi-hitan_stop.png)
![Višejezičnost EN/BS](../images/ia/hmi-visejezicnost.png)

![Asinhroni motor u postrojenju](../images/ia/asinhroni-motor.jpg)
*Asinhroni motor pogonjen preko ATV12 invertora (fizički dio postrojenja).*

#### Hijerarhija prava pristupa

| Grupa | Pokretanje | Promjena brzine | Promjena smjera | Postavke / korisnici | Historija |
| --- | :-: | :-: | :-: | :-: | :-: |
| **Neprijavljeni** | ✔ | ✘ | ✘ | ✘ | ✘ |
| **Crew** | ✔ | ✔ | ✘ | ✘ | ✘ |
| **Inspector** | ✔ | ✔ | ✔ | ✘ | ✔ |
| **Admin** | ✔ | ✔ | ✔ | ✔ | ✔ |

Dizajn je verbalno obrazložen pozivanjem na **NUREG-0700** (kontrolna soba) i **Rockwell Automation Guide to Effective Machine Control**, uz samokritiku: *taster STOP je ostao stalno crven i kad je mašina zaustavljena, što je u suprotnosti s preporukom da boja odražava trenutno stanje.*

### Moj doprinos (17 h, prema dnevniku)

| Aktivnost | Sati |
| --- | :-: |
| Upoznavanje s Modbus protokolom i registrima ATV12 | 4 |
| Konfiguracija invertora i PLC ↔ ATV12 komunikacija | 4 |
| Rekonfiguracija nakon prvog neuspješnog testa | 3 |
| Test prve verzije programa | 3 |
| Test finalne verzije | 2 |
| Crtanje principijelne sheme | 1 |

### Šta sam naučio

- Modbus registre nije dovoljno pročitati — **redoslijed bitova i refresh ciklus** drive bloka odlučuju hoće li komanda uopšte prošati.
- Prva konfiguracija **nije radila**; tek je rekonfiguracija (adresa, baud, timeout) riješila problem — dijagnostika serijskog linka je skuplja od samog programiranja.
- HMI bez hijerarhije prava pristupa nije industrijsko rješenje, nego demo.

---

## Dvopoložajna regulacija temperature na programabilnom releju (Eaton easy512)

**Predmet:** Principi automatizacije i upravljanja (PAPU) · zadatak 2 · 2026.

!!! abstract "U jednoj rečenici"
    Temperaturna komora (220 V sijalica kao grijač, NTC senzor) regulisana je **on/off algoritmom s histerezom** na **Eaton easy512-DC-RC** releju — prvo identifikacijom termičkog sistema izmjerenim odzivom, pa projektovanjem komparatora u **EASY-SOFT ljestvičastom jeziku** i verifikacijom u **Simulink** modelu.

### Setup

| Dio | Realizacija |
| --- | --- |
| Upravljački uređaj | **Eaton easy512-DC-RC**, 24 V DC, EASY-SOFT |
| Ulazni signal | **NTC 10 kΩ @ 20 °C** (540 Ω @ 120 °C) na analognom ulazu **I7** |
| Izlazni aktuator | **Q1** → relej → **220 V sijalica** (grijač) |
| Analogni preduslov | most sa napajanjem **10 V**, 12-bitni ADC MCC kartice |
| Ciljna temperatura | **46 ± 1,5 °C**, u praksi pomjerena na **48,5 ± 2,5 °C** radi linearnijeg dijela NTC karakteristike |

![Spajanje na easy512 relej](../images/regulacija/plc-spajanje.png)
*Realizacija spoja na easy512-DC-RC: analogni ulaz I7 (NTC) i izlaz Q1 na 220 V grijač.*

![NTC mjerno kolo](../images/regulacija/ntc-kolo.png)
*Naponski razdjelnik s NTC-om na napajanju 10 V — izlaz ide na 12-bitni ADC.*

Otpor NTC-a se iz izmjerenog izlaznog napona računa kao

$$
R_n=\frac{1{,}64}{10-V_{izl}}\cdot V_{izl},\qquad
T={76{,}716\,e^{-1{,}6759\,R_n}}+{79{,}481\,e^{-0{,}194\,R_n}}
$$

### Identifikacija sistema izmjerenim odzivom

Na osnovu step-odziva grijanja i hlađenja modelovan je sistem **prvog reda sa kašnjenjem** u oba smjera:

| Režim | Vremenska konstanta τ | Pojačanje K |
| --- | --- | --- |
| Grijanje (Q1 = 1) | **115,2089 s** | **+0,2786** |
| Hlađenje (Q1 = 0) | **151,3189 s** | **−0,2542** |

![Blokovska struktura simulacije](../images/regulacija/blokovska-struktura.png)

### Implementacija u EASY-SOFT

Regulator je ispisan **ljestvičastim programom** u EASY-SOFT okruženju: usporedba izmjerene temperature s gornjom i donjom granicom histereze (analogni komparator) direktno upravlja izlazom Q1.

![Ljestvičasti program regulatora](../images/regulacija/ladder.png)

![Parametri analognog komparatora](../images/regulacija/komparator.png)
*Postavke komparatora — širina histerezisnog pojasa određuje broj preključenja.*

U **Simulink** modelu sistem prvog reda je implementiran integratorom, a regulator klasičnim **Relay** blokom (histereza) — time je broj preključenja i amplituda oscilacije direktno mjerljiva:

![Simulink model i simulacija](../images/regulacija/simulink-model.png)

### Rezultat i trade-off

Veća histereza → **manje preključivanja grijača** (duži vijek releja), ali **veće talasanje temperature**; manja histereza → preciznija temperatura uz brzo trošenje izlaznog releja. Izabrana je vrijednost pri kojoj je temperatura držana u traženom intervalu uz prihvatljiv broj ciklusa.

!!! warning "Uočena nekonzistentnost u radi"
    Tekst izvještaja tvrdi da se sistem **hladi brže** nego što se grije, ali izmjerene konstante kažu suprotno: τ<sub>hladenja</sub> = 151,3 s > τ<sub>grijanja</sub> = 115,2 s. Ispravno tumačenje je da **grijanje dominira** (jači izvor od gubitaka), pa se sistem sporije hladi.

### Materijali

`Data/PAPU P2/` — EASY-SOFT projektat (ljestveni jezik), PDF izvještaj, Simulink model, `.lvm` snimci mjerenja.

---

## Dokumentacija i kod

| Artefakt | Lokacija |
| --- | --- |
| IA seminarski rad (PDF), shema, HMI projektat | `Data/IA_Projekat_Krdzalic_Muratagic_Sabic/` |
| PAPU zadatak 2 (EASY-SOFT, Simulink, izvještaj) | `Data/PAPU P2/` |
| Dnevnik aktivnosti i predračun | priloženi u IA radu |
