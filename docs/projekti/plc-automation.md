# PLC & Automatizacija

Projekti industrijske automatizacije: programiranje **Schneider** PLC-a, komunikacija preko **Modbus** protokola i izrada **HMI** vizualizacija.

---

## Projekat 1 — [Naziv projekta, npr. "Automatizacija postrojenja za [...]"]

**Kontekst:** [opis procesa i razlog zašto je automatizacija potrebna]

**Cilj i opseg:**

- [Izrada listinga u SoMachine / EcoStruxure Control Expert]
- [Komunikacija PLC–HMI preko Modbus RTU/TCP]
- [Bezbednosni lanci i ručni/auto režim rada]

**Alati i hardver:**

- PLC: [Schneider M221 / M241 / Modicon M340]
- Softver: [EcoStruxure Control Expert x.y / SoMachine Basic]
- HMI: [Magelis / Weintek / VT-X]
- Komunikacija: [Modbus RTU RS-485, Modbus TCP Ethernet]

**Mapiranje registara (Modbus):**

| Adresa | Tip | Značenje | Smjer |
| --- | --- | --- | --- |
| `%MW0` | Holding | Komanda start/stop | HMI → PLC |
| `%MW10` | Holding | Referenca temperature | HMI → PLC |
| `%IW20` | Input | Trenutna temperatura | PLC → HMI |

**Rezultati:**

- [Vrijeme ciklusa: ... ms]
- [Broj ulazno/izlaznih tačaka: ...]
- [Smanjenje vremena zastoja / broj zaustavljanja: ...]

## Projekat 2 — [Naziv projekta, npr. "SCADA nadzor nad postrojenjem"]

**Kontekst:** [opis]

**Rezultati:** [metrike]

## Fragment listinga (strukturirani primjer)

```iecst
(* Auto režim: rampa reference uz limit *)
IF auto_mod AND NOT alarm THEN
    IF reference > setpoint THEN
        setpoint := MIN(setpoint + ramp_step, reference);
    ELSE
        setpoint := MAX(setpoint - ramp_step, reference);
    END_IF;
END_IF;
```

## Dokumentacija i kod

- Repozitorij: `[link]`
- FSD / shema elektro ormara: `[link]`
- HMI projekat: `[link]`

## Refleksija

- [...]
