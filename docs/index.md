# Emir — BSc Inženjerski Portfolio

Bachelor (BSc) projekti s **Elektrotehničkog fakulteta u Sarajevu** (Odsjek za automatiku i elektroniku): real-time simulacija energetskih sistema, industrijska automatizacija, obrada signala i PID regulacija, ugrađeni sistemi i FPGA, te mehatronika.

Sve stranice nastale su iz **stvarnih projektnih zadataka i seminarskih radova** — svaka sadrži konkretne parametre, rezultate i, gdje je primjenjivo, granične uslove i ograničenja modela.

## Projekti

| Projekat | Šta je rađeno | Oblast |
| --- | --- | --- |
| **Modeliranje i simulacija sistema vođenja mikromreže u Typhoon HIL okruženju** *(završni rad)* | HIL 402 u realnom vremenu, rule-based EMS u **C-u** na **Raspberry Pi 5**, ETH VE komunikacija, mrežni i ostrvski režim | [Mikroreže & BESS](projekti/microgrids.md) |
| **Boost pretvarač za punjenje 18650 paketa** | 13S4P paket 48 V / 10 Ah, CC-CV profil, proračun L i C, state-space i prenosna funkcija, MATLAB | [Mikroreže & BESS](projekti/microgrids.md) |
| **Postrojenje za regulaciju brzine asinhronog motora** | **Schneider** TM200 + ATV12 + HMISTU855, Modbus, drive blokovi, HMI s hijerarhijom pristupa, elektro shema i predračun | [PLC & Automatizacija](projekti/plc-automation.md) |
| **Dvopoložajna regulacija temperature** | **Eaton easy512**, EASY-SOFT ljestvičasti jezik, identifikacija sistema prvog reda iz mjerenja, Simulink verifikacija | [PLC & Automatizacija](projekti/plc-automation.md) |
| **PID regulacija brzine DC motora** | identifikacija (tahogenerator + MCC kartica), **MATLAB PID Tuner**, anti-windup, simulacija vs. eksperiment | [Obrada Signala & Simulacije](projekti/obrada-signala.md) |
| **Linearnizacija NTC termistora + LabVIEW** | optimizacija R1 (`fminsearch`, SSE), akvizicija u LabVIEW-u, uporedba uzlaznog/silaznog mjerenja | [Obrada Signala & Simulacije](projekti/obrada-signala.md) |
| **A/D konvertor u asembleru (NXP LPC1114)** | Cortex-M0 Thumb, direktno upravljanje registrima (`SYSAHBCLKCFG`, `PDRUNCFG`, `IOCON`), multipleksani 7-segment displej | [Ugrađeni Sistemi & FPGA](projekti/embedded-fpga.md) |
| **Digitalno kolo na Gowin FPGA** | SystemVerilog, dijelilak takta + T flip-flopovi, sinteza resursa, **Verilator** simulacija | [Ugrađeni Sistemi & FPGA](projekti/embedded-fpga.md) |
| **Upravljanje dronom (Pixhawk 4 + Raspberry Pi)** | **ROS Noetic / MAVROS**, MAVLink preko UART-a, kalibracije, test letovi, 3D-štampano kućište | [Mehatronika & Robotika](projekti/mehatronika.md) |

## Okvir i alat

| Domen | Platforme i alati |
| --- | --- |
| Real-time simulacija | **Typhoon HIL 402**, HIL Control Center, SCADA |
| Automatizacija | Schneider Modicon M221 (**Machine Expert Basic**), **Vijeo Designer**, Eaton **EASY-SOFT** |
| Modelovanje i obrada | **MATLAB / Simulink**, **LabVIEW**, MCC ME-RedLab 1208FS |
| Ugrađeni sistemi | ARM **Cortex-M0** asembler (Thumb), NXP LPC1114FN28 |
| Digitalne sklopke | **SystemVerilog**, **Gowin EDA** (GW1N-1), **Verilator** / GTKWave |
| Robotika | **ROS Noetic**, **MAVROS**, Pixhawk 4, Ubuntu 20.04 |
| Programiranje | **C**, Python, MATLAB, Structured Text (IEC 61131-3), Verilog/SystemVerilog |

## Pristup radu

Svaki projekat je obrađen istim redoslijedom: **problem → model → implementacija → mjerenje → granice valjanosti modela**. Tamo gdje se rezultati simulacije i eksperimenta ne poklapaju, razlika je opisana i obrazložena (npr. trenje i mrtva zona kod DC motora, koncentrisani modeli komponenti na HIL platformi).

Primjer prikaza formula i koda — ciljni raspon napona mikromreže i fragment EMS logike:

$$
V_{\text{meas}} \notin \langle 0{,}9;\,1{,}1\rangle \cdot V_{\text{nom}}
\quad\lor\quad
f_{\text{meas}} \notin \langle 0{,}99;\,1{,}01\rangle \cdot f_{\text{nom}}
\;\Longrightarrow\; \text{islanded}
$$

```c
/* Pravilo Cond4: mreža je nestala -> prelazak u ostrvski režim */
if (!(v_meas >= 0.90f * V_NOM && v_meas <= 1.10f * V_NOM) ||
    !(f_meas >= 0.99f * F_NOM && f_meas <= 1.01f * F_NOM)) {
    grid_connected = 0;          /* BESS prelazi u grid-forming */
    shed_non_priority_loads();   /* zadržava se prioritet od 5 kW */
}
```

## Dokument

| Stavka | Podatak |
| --- | --- |
| Završni rad | *Modeliranje i simulacija sistema vođenja mikromreže u Typhoon HIL okruženju*, ETF Sarajevo, juli 2026. |
| Mentor | v. prof. dr Senad Huseinbegović |
| Izvorni materijali | projektni PDF-ovi, Simulink/EASY-SOFT/HMI projekati i MATLAB skripte dostupni lokalno (`Data/`) |

Kontakt informacije, obrazovanje i CV: [Kontakt & CV](kontakt.md).
