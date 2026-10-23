# Portfolio — BSc inženjerski projekti

Lični tehnički portfolio izrađen uz **MkDocs** i temu **Material for MkDocs**.
Sadržaj je pisan iz stvarnih projektnih zadataka i seminarskih radova s
Elektrotehničkog fakulteta u Sarajevu (real-time simulacija energetskih sistema,
industrijska automatizacija, obrada signala, ugrađeni sistemi/FPGA, mehatronika).

## Pokretanje lokalno

```bash
uv venv --python 3.11
uv pip install mkdocs mkdocs-material
mkdocs serve            # http://127.0.0.1:8000
```

## Struktura

```
mkdocs.yml                  konfiguracija teme, ekstenzija i navigacije
docs/index.md               početna strana i pregled projekata
docs/kontakt.md             kontakt, obrazovanje, vještine
docs/projekti/*.md          stranice projekata
docs/images/<projekat>/     figure (sheme, HMI ekrani, fotografije)
docs/javascripts/mathjax.js MathJax pokretanje za pymdownx.arithmatex
```

## Izgradnja

```bash
mkdocs build --strict       # staje na prekinute linkove i nedostajuće slike
```
