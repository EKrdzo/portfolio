# Emir Krdžalić — BSc Engineering Portfolio

Bachelor (BSc) projects from the **Faculty of Electrical Engineering in Sarajevo** (Department of Automatic Control and Electronics): real-time simulation of power systems, industrial automation, signal processing and PID control, embedded systems and FPGA, and mechatronics.

Every page comes from a **real project assignment or term paper** — each one contains concrete parameters, results and, where applicable, boundary conditions and model limitations.

## Projects

| Project | What was done | Area |
| --- | --- | --- |
| **Modelling and simulation of a microgrid energy-management system in the Typhoon HIL environment** *(thesis)* | HIL 402 in real time, rule-based EMS in **C** on a **Raspberry Pi 5**, ETH VE communication, grid-connected and islanded modes | [Microgrids & BESS](projekti/microgrids.md) |
| **Boost converter for charging an 18650 pack** | 13S4P pack, 48 V / 10 Ah, CC-CV profile, L and C design, state-space model and transfer function, MATLAB, Typhoon HIL | [Microgrids & BESS](projekti/microgrids.md) |
| **Speed-control plant for an induction motor** | **Schneider** TM200 + ATV12 + HMISTU855, Modbus, drive function blocks, HMI with access hierarchy, wiring diagram and cost estimate | [PLC & Automation](projekti/plc-automation.md) |
| **Two-position temperature control** | **Eaton easy512**, EASY-SOFT ladder diagram, first-order system identification from measurements, Simulink verification | [PLC & Automation](projekti/plc-automation.md) |
| **PID speed control of a DC motor** | identification (tachogenerator + MCC card), **MATLAB PID Tuner**, anti-windup, simulation vs. experiment | [Signal Processing & Simulation](projekti/obrada-signala.md) |
| **NTC thermistor linearisation + LabVIEW** | optimisation of R1 (`fminsearch`, SSE), acquisition in LabVIEW, comparison of upsweep/downsweep measurements | [Signal Processing & Simulation](projekti/obrada-signala.md) |
| **A/D converter in assembly language (NXP LPC1114)** | Cortex-M0 Thumb, direct register manipulation (`SYSAHBCLKCFG`, `PDRUNCFG`, `IOCON`), multiplexed 7-segment display | [Embedded & FPGA](projekti/embedded-fpga.md) |
| **Digital circuit on a Gowin FPGA** | SystemVerilog, clock divider + T flip-flops, resource synthesis, **Verilator** simulation | [Embedded & FPGA](projekti/embedded-fpga.md) |
| **Drone control (Pixhawk 4 + Raspberry Pi)** | **ROS Noetic / MAVROS**, MAVLink over UART, calibrations, test flights, 3D-printed enclosure | [Mechatronics & Robotics](projekti/mehatronika.md) |

## Framework and tools

| Domain | Platforms and tools |
| --- | --- |
| Real-time simulation | **Typhoon HIL 402**, HIL Control Center, SCADA |
| Automation | Schneider Modicon M221 (**Machine Expert Basic**), **Vijeo Designer**, Eaton **EASY-SOFT** |
| Modelling and signal processing | **MATLAB / Simulink**, **LabVIEW**, MCC ME-RedLab 1208FS |
| Embedded systems | ARM **Cortex-M0** assembly (Thumb), NXP LPC1114FN28 |
| Digital design | **SystemVerilog**, **Gowin EDA** (GW1N-1), **Verilator** / GTKWave |
| Robotics | **ROS Noetic**, **MAVROS**, Pixhawk 4, Ubuntu 20.04 |
| Programming | **C**, Python, MATLAB, Structured Text (IEC 61131-3), Verilog/SystemVerilog |

## Approach

Every project is covered in the same order: **problem → model → implementation → measurement → limits of model validity**. Where the simulation and experimental results do not match, the difference is described and explained (e.g. friction and dead zone on the DC motor, lumped component models on the HIL platform).

An example of how formulas and code render — the microgrid voltage target range and a fragment of the EMS logic:

$$
V_{\text{meas}} \notin \langle 0.9;\,1.1\rangle \cdot V_{\text{nom}}
\quad\lor\quad
f_{\text{meas}} \notin \langle 0.99;\,1.01\rangle \cdot f_{\text{nom}}
\;\Longrightarrow\; \text{islanded}
$$

```c
/* Rule Cond4: the grid has disappeared -> transition to islanded mode */
if (!(v_meas >= 0.90f * V_NOM && v_meas <= 1.10f * V_NOM) ||
    !(f_meas >= 0.99f * F_NOM && f_meas <= 1.01f * F_NOM)) {
    grid_connected = 0;          /* BESS switches to grid-forming */
    shed_non_priority_loads();   /* the 5 kW priority load is kept */
}
```

## Document

| Item | Detail |
| --- | --- |
| Thesis | *Modelling and simulation of a microgrid energy-management system in the Typhoon HIL environment*, ETF Sarajevo, July 2026. |
| Supervisor | Associate Professor Senad Huseinbegović, PhD |
| Source materials | project PDFs, Simulink/EASY-SOFT/HMI projects and MATLAB scripts available locally (`Data/`) |

Contact details and education: [Contact & CV](kontakt.md).
