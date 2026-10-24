# Mechatronics & Robotics

Integrating sensors, a computer and a flight controller into one system — from sensor calibration to a **3D-printed enclosure**.

---

## Drone control using a Pixhawk controller and a Raspberry Pi

**Course:** Mechatronics · supervisor: Full Professor Jasmin Velagić, PhD · assistant: Tarik Pozderac · July 2026.
**Team:** E. Krdžalić, S. Muratagić, A. Šabić

!!! abstract "In one sentence"
    A **Pixhawk 4** (STM32F765, Cortex-M7) was mounted on a quadcopter as the flight controller and a **Raspberry Pi 4** as the onboard computer running **Ubuntu 20.04 + ROS Noetic**, connected by the **MAVLink/MAVROS** protocol over UART; a **modular 3D-printed enclosure** for both devices was also designed, and the system was tested through calibration, a static test and manual flights.

### System architecture

<div class="svg-diagram">
<svg viewBox="0 0 900 250" role="img" aria-label="Architecture: Raspberry Pi 4 (ROS Noetic) – MAVLink – Pixhawk 4 – ESCs/motors" style="width:100%;height:auto;font-family:inherit;font-size:14px">
  <style>
    .box{fill:currentColor;fill-opacity:.06;stroke:currentColor;stroke-opacity:.45;stroke-width:1.5}
    .txt{fill:currentColor}
    .sm{font-size:11.5px;opacity:.72}
    .ln{stroke:currentColor;stroke-opacity:.55;stroke-width:1.8;fill:none}
  </style>
  <rect class="box" x="20" y="40" width="230" height="96" rx="6"/>
  <text class="txt" x="135" y="70" text-anchor="middle">Raspberry Pi 4 Model B</text>
  <text class="txt sm" x="135" y="92" text-anchor="middle">Ubuntu Server 20.04 LTS</text>
  <text class="txt sm" x="135" y="110" text-anchor="middle">ROS Noetic + MAVROS</text>
  <rect class="box" x="335" y="40" width="230" height="96" rx="6"/>
  <text class="txt" x="450" y="70" text-anchor="middle">Pixhawk 4</text>
  <text class="txt sm" x="450" y="92" text-anchor="middle">STM32F765 · Cortex-M7</text>
  <text class="txt sm" x="450" y="110" text-anchor="middle">TELEM1/2 · GPS1/2 · DEBUG</text>
  <rect class="box" x="650" y="40" width="230" height="96" rx="6"/>
  <text class="txt" x="765" y="70" text-anchor="middle">Motors and sensors</text>
  <text class="txt sm" x="765" y="92" text-anchor="middle">up to 16 ESC outputs</text>
  <text class="txt sm" x="765" y="110" text-anchor="middle">accel · gyro · compass · RC</text>
  <line class="ln" x1="250" y1="88" x2="335" y2="88"/>
  <text class="txt sm" x="292" y="78" text-anchor="middle">UART</text>
  <text class="txt sm" x="292" y="160" text-anchor="middle">MAVLink / MAVROS</text>
  <line class="ln" x1="565" y1="88" x2="650" y2="88"/>
  <text class="txt sm" x="607" y="78" text-anchor="middle">PWM/DShot</text>
  <rect class="box" x="20" y="180" width="860" height="50" rx="6"/>
  <text class="txt" x="450" y="211" text-anchor="middle">Modular enclosure (upper + lower part) — 3D printed, FFF</text>
</svg>
</div>

| Layer | Hardware / software |
| --- | --- |
| Flight controller | **Pixhawk 4** (STM32F765, Cortex-M7), 5 UART ports, up to 16 ESC outputs |
| Computer | **Raspberry Pi 4 Model B** |
| Operating system | **Ubuntu Server 20.04 LTS** |
| Middleware | **ROS Noetic**, **MAVROS** nodes (MAVLink bridging) |
| Communication | UART between the RPi and the Pixhawk, MAVLink telemetry and commands |
| Enclosure | custom design, **2 parts (upper/lower)**, 3D printed |

### Implementation steps

1. **Calibrations** at the ground station: accelerometer, gyroscope, magnetometer (compass), radio controller (RC calibration).
2. **Motor test** without propellers and a **static test** with propellers (checking rotation direction, ESC order, E-STOP).
3. **Manual flights** — checking stabilisation, response to RC commands, verifying telemetry on the RPi through MAVROS.
4. **Enclosure**: modelled so that the RPi 4 and Pixhawk 4 are mechanically separated and their ports remain accessible (airflow was solved with openings in the enclosure).

### Results

- Two-way **MAVLink communication** established between the ROS nodes and the flight controller;
- calibrations succeeded and **manual flights were carried out**;
- **enclosure 2D/3D documentation completed** (`.step` model, PDF documentation, flight recording `.mp4`).

!!! warning "Autonomous flight not carried out"
    The planned waypoint-based autonomous flight **was not performed** because of problems with the **GPS module** (too few fixed satellites / poor fix in the conditions where testing took place). The thesis conclusion: without a reliable GPS position, autonomy is not testable, so the focus shifted to proving the communication and mechanical parts of the system.

### What I learned

- **The order of calibrations is not arbitrary** — a compass error propagates into the attitude estimate, and from there into the controller response.
- **MAVROS is a bridge, not a brain**: the ROS nodes think in `setpoint` topics, and anything that does not pass through the MAVLink schema simply does not exist.
- The mechanical part (enclosure, vibrations, port access) decides whether the system can be tested at all — the software part is easier than it looks.

---

## Documentation and code

| Artefact | Location |
| --- | --- |
| PDF report | `Data/MEH_Projektni_Zadatak_Krdzalic_Muratagic_Sabic/` |
| 3D model of the enclosure | `Drone Case Model.step` |
| Enclosure documentation | `MEH_Pi_Case.pdf` |
| Test flight recording | `MEH_Test_Flight.mp4` |
