# Portfolio — BSc engineering projects

Personal technical portfolio built with **MkDocs** and the **Material for MkDocs** theme.
The content is based on real project assignments and term papers from the
Faculty of Electrical Engineering in Sarajevo (real-time power system simulation,
industrial automation, signal processing, embedded systems/FPGA, mechatronics).

## Running locally

```bash
uv venv --python 3.11
uv pip install mkdocs mkdocs-material
mkdocs serve            # http://127.0.0.1:8000
```

## Structure

```
mkdocs.yml                  theme, extension and navigation configuration
docs/index.md               home page and project overview
docs/kontakt.md             contact, education, skills
docs/projekti/*.md          project pages
docs/images/<project>/      figures (diagrams, HMI screens, photographs)
docs/stylesheets/extra.css  uniform figure sizes and image galleries
docs/javascripts/mathjax.js MathJax bootstrap for pymdownx.arithmatex
```

## Building

```bash
mkdocs build --strict       # fails on broken links and missing images
```
