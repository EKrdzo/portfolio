# Mehatronika & Robotika

Integracija senzora, računara i letačkog kontrolera u jedan sistem — od kalibracije senzora do **3D-štampanog kućišta**.

---

## Upravljanje dronom koristeći Pixhawk kontroler i Raspberry Pi

**Predmet:** Mehatronika · mentor: red. prof. dr sc. Jasmin Velagić · asistent: Tarik Pozderac · juli 2026.
**Tim:** E. Krdžalić, S. Muratagić, A. Šabić

!!! abstract "U jednoj rečenici"
    Na kvadrokopter je postavljen **Pixhawk 4** (STM32F765, Cortex-M7) kao letački kontroler i **Raspberry Pi 4** kao računar s **Ubuntu 20.04 + ROS Noetic**, povezani **MAVLink/MAVROS** protokolom preko UART-a; projektovano je i **modularno kućište štampano u 3D** za oba uređaja, a sistem je testiran kalibracijom, statičkim testom i manualnim letovima.

### Arhitektura sistema

<svg viewBox="0 0 900 250" role="img" aria-label="Arhitektura: Raspberry Pi 4 (ROS Noetic) – MAVLink – Pixhawk 4 – ESC/motori" style="width:100%;height:auto;font-family:inherit;font-size:14px">
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
  <text class="txt" x="765" y="70" text-anchor="middle">Motori i senzori</text>
  <text class="txt sm" x="765" y="92" text-anchor="middle">do 16 ESC izlaza</text>
  <text class="txt sm" x="765" y="110" text-anchor="middle">akcel · žiro · kompas · RC</text>

  <line class="ln" x1="250" y1="88" x2="335" y2="88"/>
  <text class="txt sm" x="292" y="78" text-anchor="middle">UART</text>
  <text class="txt sm" x="292" y="160" text-anchor="middle">MAVLink / MAVROS</text>
  <line class="ln" x1="565" y1="88" x2="650" y2="88"/>
  <text class="txt sm" x="607" y="78" text-anchor="middle">PWM/DShot</text>

  <rect class="box" x="20" y="180" width="860" height="50" rx="6"/>
  <text class="txt" x="450" y="211" text-anchor="middle">Modularno kućište (gornji + donji dio) — 3D štampa, FFF</text>
</svg>

| Sloj | Oprema / softver |
| --- | --- |
| Letački kontroler | **Pixhawk 4** (STM32F765, Cortex-M7), 5 UART portova, do 16 ESC izlaza |
| Računalo | **Raspberry Pi 4 Model B** |
| Operativni sistem | **Ubuntu Server 20.04 LTS** |
| Middleware | **ROS Noetic**, čvorovi **MAVROS** (MAVLink bridging) |
| Komunikacija | UART između RPi-ja i Pixhawka, MAVLink telemetrija i komande |
| Kućište | vlastiti dizajn, **2 dijela (gornji/donji)**, 3D printano |

### Koraci implementacije

1. **Kalibracije** na teren-skoj stanici: akcelerometar, žiroskop, magnetometar (kompas), radio kontroler (RC calibration).
2. **Test motora** bez propelera i **statički test** s propelerima (provjera smjera rotacije, redoslijed ESC-ova, E-STOP).
3. **Manualni letovi** — provjera stabilizacije, odziv RC komandi, provjera telemetrije na RPi-ju preko MAVROS-a.
4. **Kućište**: modelirano tako da RPi 4 i Pixhawk 4 budu mehanički odvojeni i dostupni za portove (protok zraka riješen je otvorima na kućištu).

### Rezultati

- Uspostavljena dvosmjerna **MAVLink komunikacija** između ROS čvorova i letačkog kontrolera;
- uspjeh kalibracija i **izvedeni manualni letovi**;
- **dovršena 2D/3D dokumentacija kućišta** (`.step` model, PDF dokumentacija, snimak leta `.mp4`).

!!! warning "Autonomni let nije realizovan"
    Planirani autonomni let po waypoint-ima **nije izveden** zbog problema s **GPS modulom** (nedovoljno fiksnih satelita / loš fix u uslovima u kojima se testiralo). Zaključak rada: bez pouzdane GPS pozicije autonomija nije testabilna, pa je fokus prebačen na dokaz komunikacijskog i mehaničkog dijela sistema.

### Šta sam naučio

- **Redoslijed kalibracija nije proizvoljan** — greška kompasa se prenosi na procjenu attitude-a, pa i na odziv controller-a.
- **MAVROS je most, ne mozak**: ROS čvorovi razmišljaju u `setpoint` temama, a sve što ne prođe kroz MAVLink shemu jednostavno ne postoji.
- Mehanički dio (kućište, vibracije, pristup portovima) odlučuje hoće li se sustav uopšte moći testirati — softverski dio je lakši nego što izgleda.

---

## Dokumentacija i kod

| Artefakt | Lokacija |
| --- | --- |
| PDF izvještaj | `Data/MEH_Projektni_Zadatak_Krdzalic_Muratagic_Sabic/` |
| 3D model kućišta | `Drone Case Model.step` |
| Dokumentacija kućišta | `MEH_Pi_Case.pdf` |
| Snimak testa leta | `MEH_Test_Flight.mp4` |
