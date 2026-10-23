# Mikroreže & BESS

Projekti iz oblasti mikroreži, sistema za akumulaciju energije (BESS) i energetskih pretvarača, uglavnom realizirani u **Typhoon HIL** simulatoru.

---

## Projekat 1 — [Naziv projekta, npr. „Model mikroreže sa BESS-om u HIL simulatoru"]

**Kontekst:** [kratki opis problema — npr. ispitivanje stabilnosti napona u ostrvskoj mikroreži pri promjeni opterećenja]

**Cilj i opseg:**

- [Modeliranje glavne mreže i distributivnog voda u HIL Schematic editoru]
- [Integracija BESS-a sa DC/AC energetskim pretvaračem]
- [Provjera ponašanja u ostrvskom (islanded) i mrežnom režimu]

**Alati i hardver:**

- Typhoon HIL [604/606/704], HIL Control Center [x.y]
- [PSCAD / MATLAB-Simulink] za referentni model
- [Mjerna oprema, osciloskop, RTP/GPIO interface]

**Rezultati:**

| Metrika | Vrijednost | Napomena |
| --- | --- | --- |
| Napon u stacionarnom stanju | [...] p.u. | |
| Frekvencija (islanded) | [...] Hz | |
| Vrijeme regulacije | [...] ms | |

<!-- Sliku dodaj u docs/images/, zatim odkomentariši red ispod:
![Shema mikroreže](../images/microgrid-shema.png)
-->


## Projekat 2 — [Naziv projekta, npr. "Energetski pretvarač i MPPT"]

**Kontekst:** [opis]

**Cilj i opseg:**

- [Proračun i simulacija DC/DC step-up pretvarača]
- [Implementacija upravljačke petlje]

**Rezultati:** [metrike, talasi struje, efikasnost]

## Teorijska podloga

Snaga koju BESS može isporučiti u periodu \( \Delta t \), uz dubinu pražnjenja \( D_oD \):

$$
E_{isporuceno} = C_n \cdot D_oD \cdot U_n, \qquad P_{max} = \frac{E_{isporuceno}}{\Delta t}
$$

## Dokumentacija i kod

- Repozitorij: `[link]`
- Završni izvještaj / PDF: `[link]`

## Refleksija

- Šta je bilo najzahtjevnije: [...]
- Šta bi se uradilo drugačije: [...]
