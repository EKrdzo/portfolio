# Obrada Signala & Python

Projekti u kojima se **Python** (NumPy, SciPy, Matplotlib) i **MATLAB** koriste za obradu signala, digitalno filtriranje i numeričku optimizaciju.

---

## Projekat 1 — [Naziv projekta, npr. "Obrada ECG signala i detekcija QRS kompleksa"]

**Kontekst:** [opis — npr. analizirani ECG snimci sa MIT-BIH baze, cilj pouzdano lociranje R-ževa uz prisustvo mrežnih i mišićnih smetnji]

**Cilj i opseg:**

- [Učitavanje i normalizacija ECG zapisa]
- [Digitalno filtriranje (notch 50 Hz, niskopropusni filter)]
- [Detekcija QRS kompleksa i račun srčane frekvencije]
- [Vizualizacija i evaluacija tačnosti]

**Alati:**

- Python [3.x], NumPy, SciPy, Matplotlib, [wfdb]
- [MATLAB / Signal Processing Toolbox]

**Primjer — filtriranje i detekcija:**

```python
import numpy as np
from scipy.signal import butter, sosfilt, find_peaks

def obrada_ecg(x: np.ndarray, fs: float) -> tuple[np.ndarray, np.ndarray]:
    """Niskopropusno filtriranje i detekcija R-ževa."""
    sos = butter(4, 35.0, btype="low", fs=fs, output="sos")
    xf = sosfilt(sos, x)
    vrhovi, _ = find_peaks(xf, height=0.6 * np.max(xf), distance=int(0.4 * fs))
    return xf, vrhovi
```

**Rezultati:**

| Metrika | Vrijednost |
| --- | --- |
| Tačnost detekcije | [...] % |
| Propušteni / lažni vrhovi | [...] |
| Trajanje obrade (1 min zapisa) | [...] s |

<!-- Sliku dodaj u docs/images/, zatim odkomentariši red ispod:
![ECG prije i poslije filtriranja](../images/ecg-filtrirano.png)
-->


## Projekat 2 — [Naziv projekta, npr. "MATLAB optimizacija radne tačke"]

**Cilj i opseg:**

- [Formulacija funkcije cilja i ograničenja]
- [Rješenje pomoću `fmincon` / globalne optimizacije]

Ciljna funkcija i ograničenja:

$$
\min_{x} \; f(x) \quad \text{uz} \quad g_i(x) \le 0, \; h_j(x) = 0
$$

**Rezultati:** [optimalna radna tačka, broj iteracija, konvergencija]

## Dokumentacija i kod

- Repozitorij: `[link]`
- Notebook / skripta: `[link]`

## Refleksija

- [...]
