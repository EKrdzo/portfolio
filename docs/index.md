# Emir — BSc Inženjerski Portfolio

Dobrodošli! Ovaj sajt predstavlja pregled mojih tehničkih i inženjerskih projekata nastalih tokom Bachelor (BSc) studija, sa fokusom na elektroenergetske sisteme, industrijsku automatizaciju i obradu signala.

## Oblasti rada

| Kategorija | Alati i platforme | Stranica |
| --- | --- | --- |
| Mikroreže & BESS | Typhoon HIL, energetski pretvarači, akumulacijski sistemi | [Mikroreže & BESS](projekti/microgrids.md) |
| PLC & Automatizacija | Schneider PLC, Modbus, HMI | [PLC & Automatizacija](projekti/plc-automation.md) |
| Obrada Signala & Python | Python, ECG signalizacija, MATLAB optimizacije | [Obrada Signala & Python](projekti/dsp-python.md) |

## Kako je portfolio strukturiran

Svaka stranica u sekciji **Projekti** prati isti šablon:

1. **Kratak opis** — problem i kontekst zadatka.
2. **Cilj i opseg** — šta je konkretno rađeno.
3. **Alati i hardver** — korišteni softver, hardver i norme.
4. **Rezultati** — ključne metrike, tabele i grafikoni.
5. **Dokumentacija i kod** — linkovi ka repozitorijima i pratećim izvještajima.
6. **Refleksija** — šta bi se uradilo drugačije.

!!! note "Napomena"
    Sadržaj je zasad šablon. Zamijeni tekst u uglastim zagradama (`[...]`) svojim konkretnim podacima, a slike dodaj u folder `docs/images/`.

## Kratak primer prikaza

Za proračune se koristi MathJax, npr. izraz za snagu u trofaznom sistemu:

$$
P = \sqrt{3}\, U_{ll}\, I_l \cos\varphi
$$

Kod se prikazuje uz dugme za kopiranje:

```python
def trofazna_snaga(u_ll: float, i_l: float, cos_phi: float) -> float:
    """Aktivna snaga trofaznog sistema [W]."""
    return 3 ** 0.5 * u_ll * i_l * cos_phi
```

## Kontakt

Kontakt informacije i CV dostupni su na stranici [Kontakt & CV](kontakt.md).
