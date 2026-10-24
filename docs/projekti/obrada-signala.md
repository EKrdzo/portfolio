# Signal Processing & Simulation

Measurement, linearisation of sensor signals, system identification and PID control — from the laboratory (**MCC** card, **LabVIEW**, **MATLAB/Simulink**) to experimental verification.

---

## PID speed control of a DC motor

**Course:** Principles of Automation and Control (PAPU) · project assignment 3 · 2026.

!!! abstract "In one sentence"
    The speed of a DC motor, measured with a **tachogenerator** through an **MCC ME-RedLab 1208FS** card, was controlled by a PID whose parameters were obtained in the **MATLAB PID Tuner** from identified transfer functions, then implemented in **Simulink** and on the actual plant — including **anti-windup** and protection against noise in the feedback path.

### Measured system

| Element | Implementation |
| --- | --- |
| Actuator | DC motor **12 V**, control signal **0–10 V** |
| Measurement | **tachogenerator** (voltage proportional to speed) |
| I/O | **MCC ME-RedLab 1208FS**, 12-bit ADC/DAC |
| Software | MATLAB (identification, `pidtune`) + Simulink + experiment |

![System block diagram](../images/pidu/blok-dijagram.png)

![Wiring diagram](../images/pidu/shema-spajanja.png)

### Identification

**Two separate** transfer functions were identified — the motor behaves differently while accelerating than while stopping (friction and loss asymmetry):

$$
G_{\text{accel}}(s)=\frac{27.2541}{0.24\,s+1},\qquad
G_{\text{stop}}(s)=\frac{26.964}{0.133\,s+1}
$$

### Controller parameters

The PID was tuned in the **PID Tuner** with priority on the **first overshoot** of the response (maximum damping without an unreasonably slow response):

| Variant | K<sub>p</sub> | K<sub>i</sub> | K<sub>d</sub> |
| --- | --- | --- | --- |
| **PID Tuner (adopted)** | **0.86253** | **6.8589** | **0.00074421** |
| Experimental 1 | 1.2938 | 27.4356 | — |
| Experimental 2 | 2.5876 | 5.007 | — |

The Simulink model adds:

- **saturation + anti-windup** at the controller output (otherwise the integral "bloats" while the motor cannot accelerate further);
- a **Switch + Derivative** branch that separates the response by direction of rotation (because of the different τ for acceleration/stopping);
- a filter for **tachogenerator noise** in the feedback path (the D term amplifies it directly).

![Simulink model](../images/pidu/simulink.png)

### Result: simulation vs. experiment

![Experiment and simulation](../images/pidu/eksperiment-vs-simulacija.png)
*Comparison of the simulated model response and the actual plant.*

!!! warning "What the model does not cover"
    At **lower speeds** oscillations and a **dead zone** appear because of friction — a linear first-order model does not describe that. The experimental response is therefore slower and more "jagged" than the simulated one; a considerably more correct control would need a model with friction compensation (or a two-stage controller).

---

## NTC thermistor linearisation and signal processing in LabVIEW

**Course:** Principles of Automation and Control (PAPU) · assignment 1 · 2026.

### Problem

An NTC thermistor has an **exponential** R(T) characteristic, so the voltage across it is not proportional to temperature. The task is to find the resistor **R1** in a voltage divider that makes the characteristic **as linear as possible** over the working range.

### Method

1. Resistance measured in the upsweep and downsweep of the temperature range **31 – 142 °C** (measurement hysteresis was recorded).
2. Model of the voltage across the NTC: \(V_{\text{NTC}} = V\cdot R/(R+R_1)\).
3. Linear approximation (least squares) and **optimisation of R1 by minimising the sum of squared errors** in MATLAB:

```matlab
V  = 10;  R1 = 1.19e3;
vNTC = V .* R ./ (R + R1);
lin  = -0.0579 .* T + 7.2807;          % linear approximation
sse  = @(R1) sum( (V.*R./(R+R1) - lin).^2 );
R1opt = fminsearch(sse, 1e3);          % → 1.19 kΩ
```

The result is the linear relation **V<sub>linear</sub> = −0.0959·T + 14.0389** (second measurement set: y = −0.0579·T + 7.2807 with R1 = 1.19 kΩ and a 10 V supply), and the deviation from the true curve is quantified in tables and graphically.

![Linearisation of the NTC characteristic](../images/ncg/linearnaizacija.png)

![NTC sensor characteristic](../images/ncg/karakteristika.png)

### LabVIEW implementation

Signal processing and automatic logging of data series were done in **LabVIEW** (project `LV5.lvproj`):

| File | Role |
| --- | --- |
| `InputLV5.vi` | reading the analogue input from the MCC card |
| `Zad4.vi` | main VI: voltage → temperature conversion, display, branching |
| `pomocni.vi` | auxiliary calculation (R↔T, linear approximation) |
| `*.lvm` | recorded measurement series (input for MATLAB processing) |

![MCC ME-RedLab 1208FS measurement card](../images/ncg/mcc-kartica.jpg)

### What I learned

- Linearisation is a **compromise between range and accuracy** — a better R1 for the middle of the range means worse accuracy at the ends.
- The upsweep and downsweep data do not coincide (thermistor time constant), so the linearisation has to be done on one direction or on the average.
- LabVIEW for acquisition + MATLAB for processing is still the fastest route from sensor to result.

---

## Documentation and code

| Artefact | Location |
| --- | --- |
| PAPU assignment 1 — LabVIEW VIs, MATLAB scripts, raw `.lvm` measurements (ZIP, 1.9 MB) | [Download](../attachments/papu-assignment-1/papu1-labview-matlab-measurements.zip){target=_blank} |
| PAPU assignment 3 — report `main.tex` with its EPS/PNG figures (ZIP, 678 KB) | [Download](../attachments/papu-assignment-3/papu3-report-latex-and-figures.zip){target=_blank} |