# Ugrađeni Sistemi & FPGA

Rad direktno s registrima mikrokontrolera (**ARM Cortex-M0 u asembleru**) i sinteza digitalnog kola na **FPGA** (SystemVerilog → Gowin).

---

## A/D konvertor u asembleru — NXP LPC1114FN28

**Predmet:** Praktikum automatike (ETFAEIPA3545) · nastavnici: Samim Konjičija, Selmir Gajip, Ajdin Fejzić · januar 2026.

!!! abstract "U jednoj rečenici"
    Na **LPC1114FN28** (ARM **Cortex-M0**, Thumb skup instrukcija) napisan je program u **asembleru** koji očitava potenciometar preko **10-bitnog ADC-a** i vrijednost prikazuje na **multipleksanom sedmosegmentnom displeju** — bez ijedne biblioteke i operativnog sistema, samo direktno upravljanje registrima periferije.

### Zadatak

| Dio | Realizacija |
| --- | --- |
| Ulazni signal | potenciometar na **P0.11 / AD0** (analogni napon) |
| Izlaz | **4× sedmosegmentni displej**, multipleksan |
| Anode | **P1.4, P1.5, P1.9, P1.7** (aktivne **LOW**) |
| Segmenti (a–g) | **P0.1, P0.2, P0.3, P0.6, P0.7, P0.8, P0.9** |
| Mikrokontroler | NXP **LPC1114FN28**, Cortex-M0, Thumb ISA |

### Registeri koje je bilo potrebno podesiti

Redoslijed je bitan — ADC se ne može uključiti dok se ne pusti njegov sat i dok se ne izbaci iz power-down moda:

| Registar | Vrijednost / bit | Značenje |
| --- | --- | --- |
| `SYSAHBCLKCFG` | `0x12040` | bit 6 → **GPIO** clock, bit 13 → **ADC** clock, bit 16 → **IOCON** clock |
| `PDRUNCFG` | clear bit 4 | izbacuje **ADC iz power-down** moda |
| `IOCON` | funkcija pina | P0.11 prebačen u **AD0** (analog), ostali u GPIO |
| `GPIO DIR` | smjer | izlazi za segmente/anode kao output |
| `ADC CR` / `DR` | — | start konverzije, čitanje 10-bitnog rezultata |

Vektorska tabela smještena je na **`0x10001000`** (bootloader preslikava flash na tu adresu), pa program počinje tabelom sa stogom i reset vektorom:

```asm
                .area VECTOR
                .word   0x10000400          @ početni StackTop
                .word   Reset_Handler       @ Reset
                .word   Default_Handler     @ NMI
                ...
Reset_Handler:
                LDR     R0, =SYSAHBCLKCFG
                LDR     R1, =0x12040        @ GPIO + ADC + IOCON clock
                STR     R1, [R0]
                LDR     R0, =PDRUNCFG
                LDR     R1, [R0]
                BIC     R1, R1, #(1<<4)     @ ADC power-down OFF
                STR     R1, [R0]
```

### Tok programa

1. Uključiti satove periferije i izbaciti ADC iz power-downa.
2. Podesiti `IOCON` (P0.11 → AD0) i `GPIO DIR` za segmente i anode.
3. Pokrenuti konverziju, čekati bit **DONE**, očitati `ADC_DR`.
4. Skalirati 10-bitnu vrijednost, rastaviti na cifre i **multipleksati displej** (brzo prebacivanje između anoda ≫ praga percepcije → sve četiri cifre djeluju staljno).

### Šta sam naučio

- Bez biblioteka se vidi šta instrukcija za instrukcijom radi: **clock gating i power-down su prvi uslov** bilo kakvog rada periferije.
- Multipleksiranje displeja je klasičan problem **tajminga, ne logike** — presporo treperi, prebrzo se cifre „liju".
- Thumb skup nema sve ARM instrukcije (npr. uslovni izvršavanja su ograničena), što se osjeti pri ručnom pisanju.

---

## Digitalno kolo na FPGA — Gowin GW1N-1

**Predmet:** Programabilni logički sklopovi (PLS) · 2026.

!!! abstract "U jednoj rečenici"
    U **SystemVerilogu** projektovan je brojačko-kombinatorni sklop na **Gowin GW1N-LV1QN48C6/I5** FPGA: 25-bitni dijelilak takta generiše **1 Hz** referencu, dva **T flip-flopa** broje stanja 0–3, a kombinacija izlaza `Q1`/`Q0` preko kombinatorike daje signale `C0`–`C3` i izlaz `Z`.

### Dizajn

```systemverilog
// project_fpga.sv — dijelilak takta i T flip-flopovi
always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        counter <= 27'd0;
        Q1 <= 1'b0; Q0 <= 1'b0;
    end else begin
        if (counter == 27_000_000 - 1) begin      // ~1 Hz izlaz
            counter <= 27'd0;
            Q0 <= ~Q0;                             // T flip-flop (T = 1)
            if (Q0) Q1 <= ~Q1;                     // T = Q0
        end else begin
            counter <= counter + 27'd1;
        end
    end
end

assign C0 = ~Q1 & ~Q0;
assign C1 = ~Q1 &  Q0;
assign C2 =  Q1 & ~Q0;
assign C3 =  Q1 &  Q0;
assign Z  = ~U & Q0 & Q1;                          // izlaz uslovljen ulazom U
```

Varijanta u `project.sv` koristi `cnt >= 25'd13_500_000` (ista namjena, drugačija frekvencija oscilatora pločice).

### Sinteza i resursi (Gowin)

| Resurs | Korišteno |
| --- | --- |
| I/O portovi | **8** (3 × IBUF, 5 × OBUF) |
| Registeri | **27** (DFFC) |
| LUT-ovi | **57** (LUT2: 13, LUT3: 17, LUT4: 27) |
| Logic elementi | **57 / 1152 (5 %)** |

Uređaj: **GW1N-LV1QN48C6/I5** (GW1N-1 familia), sinteza i place & route u Gowin EDA alatu.

### Simulacija

Funkcionalna provjera rađena je sa **Verilator**om — C++ test bench (`Vproject.cpp`) generiše talasni oblik `.fst` koji se pregleda u GTKWave:

```bash
verilator --cc project.sv --exe tb.cpp --trace -Wno-fatal
make -C obj_dir -f Vproject.mk && ./obj_dir/Vproject
```

!!! info "Napomena o artefaktima"
    Generisani build fajlovi (`obj_dir/`, `Vproject.cpp`, `.fst`) i sintetizni projekti nalaze se lokalno u `Data/PLS/`; na ovoj stranici su samo izvor i rezultati sinteze.

### Šta sam naučio

- Brojač od 25 bita je **lanac DFF-ova** — tek na tabeli resursa se vidi koliko logike „skriva" jedna linija `if (counter == N)`.
- Razlika između **simulacije i silicijuma** je u timingu: Verilator ne zna ništa o ruteama, a `setup`/`hold` provjera dolazi tek nakon place & route-a.
- Kombinatorni izlazi (`C0`–`C3`) su čisti dekoderi stanja — jednostavnije i brže od dodatnih registara.

---

## Dokumentacija i kod

| Artefakt | Lokacija |
| --- | --- |
| LPC1114 asemblerski listing i PDF izvještaj | `Data/PA/` |
| SystemVerilog izvori, Gowin projektat, Verilator simulacija | `Data/PLS/` |
