# Embedded & FPGA

Working directly with microcontroller registers (**ARM Cortex-M0 in assembly**) and synthesising a digital circuit on an **FPGA** (SystemVerilog → Gowin).

---

## A/D converter in assembly language — NXP LPC1114FN28

**Course:** Control Systems Laboratory (ETFAEIPA3545) · lecturers: Samim Konjičija, Selmir Gajip, Ajdin Fejzić · January 2026.

!!! abstract "In one sentence"
    A program in **assembly language** was written for the **LPC1114FN28** (ARM **Cortex-M0**, Thumb instruction set) that reads a potentiometer through the **10-bit ADC** and displays the value on a **multiplexed seven-segment display** — without a single library or operating system, just direct manipulation of the peripheral registers.

### Assignment

| Part | Implementation |
| --- | --- |
| Input signal | potentiometer on **P0.11 / AD0** (analogue voltage) |
| Output | **4× seven-segment display**, multiplexed |
| Anodes | **P1.4, P1.5, P1.9, P1.7** (**LOW**-active) |
| Segments (a–g) | **P0.1, P0.2, P0.3, P0.6, P0.7, P0.8, P0.9** |
| Microcontroller | NXP **LPC1114FN28**, Cortex-M0, Thumb ISA |

### Registers that had to be configured

The order matters — the ADC cannot be enabled before its clock is released and it is taken out of power-down mode:

| Register | Value / bit | Meaning |
| --- | --- | --- |
| `SYSAHBCLKCFG` | `0x12040` | bit 6 → **GPIO** clock, bit 13 → **ADC** clock, bit 16 → **IOCON** clock |
| `PDRUNCFG` | clear bit 4 | takes the **ADC out of power-down** mode |
| `IOCON` | pin function | P0.11 switched to **AD0** (analogue), the rest to GPIO |
| `GPIO DIR` | direction | segment/anode outputs set as outputs |
| `ADC CR` / `DR` | — | start conversion, read the 10-bit result |

The vector table is placed at **`0x10001000`** (the bootloader remaps flash to that address), so the program starts with the table holding the stack pointer and reset vector:

```asm
                .area VECTOR
                .word   0x10000400          @ initial StackTop
                .word   Reset_Handler       @ Reset
                .word   Default_Handler     @ NMI
                ...
Reset_Handler:
                LDR     R0, =SYSAHBCLKCFG
                LDR     R1, =0x12040        @ GPIO + ADC + IOCON clock
                STR     R1, [R0]
                LDR     R0, =PDRUNCFG
                LDR     R1, [R0]
                BIC     R1, R1, #(1<<4)     @ ADC power-down OFF
                STR     R1, [R0]
```

### Program flow

1. Enable the peripheral clocks and take the ADC out of power-down.
2. Configure `IOCON` (P0.11 → AD0) and `GPIO DIR` for the segments and anodes.
3. Start the conversion, wait for the **DONE** bit, read `ADC_DR`.
4. Scale the 10-bit value, split it into digits and **multiplex the display** (switching between anodes far above the perception threshold → all four digits appear steady).

### What I learned

- Without libraries you see what instruction after instruction actually does: **clock gating and power-down are the first precondition** for any peripheral to work.
- Display multiplexing is a classic **timing problem, not a logic one** — too slow it flickers, too fast the digits bleed into each other.
- The Thumb instruction set does not have all ARM instructions (conditional execution, for example, is limited), which you feel when writing by hand.

---

## Digital circuit on an FPGA — Gowin GW1N-1

**Course:** Programmable Logic Devices (PLS) · 2026.

!!! abstract "In one sentence"
    A counter-combinational circuit was designed in **SystemVerilog** for the **Gowin GW1N-LV1QN48C6/I5** FPGA: a 25-bit clock divider generates a **1 Hz** reference, two **T flip-flops** count states 0–3, and the combination of the `Q1`/`Q0` outputs through combinational logic produces the `C0`–`C3` signals and the `Z` output.

### Design

```systemverilog
// project_fpga.sv — clock divider and T flip-flops
always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        counter <= 27'd0;
        Q1 <= 1'b0; Q0 <= 1'b0;
    end else begin
        if (counter == 27_000_000 - 1) begin      // ~1 Hz output
            counter <= 27'd0;
            Q0 <= ~Q0;                             // T flip-flop (T = 1)
            if (Q0) Q1 <= ~Q1;                     // T = Q0
        end else begin
            counter <= counter + 27'd1;
        end
    end
end

assign C0 = ~Q1 & ~Q0;
assign C1 = ~Q1 &  Q0;
assign C2 =  Q1 & ~Q0;
assign C3 =  Q1 &  Q0;
assign Z  = ~U & Q0 & Q1;                          // output gated by input U
```

The variant in `project.sv` uses `cnt >= 25'd13_500_000` (same purpose, different board oscillator frequency).

### Synthesis and resources (Gowin)

| Resource | Used |
| --- | --- |
| I/O pins | **8** (3 × IBUF, 5 × OBUF) |
| Registers | **27** (DFFC) |
| LUTs | **57** (LUT2: 13, LUT3: 17, LUT4: 27) |
| Logic elements | **57 / 1152 (5 %)** |

Device: **GW1N-LV1QN48C6/I5** (GW1N-1 family), synthesis and place & route in the Gowin EDA tool.

### Simulation

Functional verification was done with **Verilator** — the C++ test bench (`Vproject.cpp`) generates a `.fst` waveform that is inspected in GTKWave:

```bash
verilator --cc project.sv --exe tb.cpp --trace -Wno-fatal
make -C obj_dir -f Vproject.mk && ./obj_dir/Vproject
```

### What I learned

- A 25-bit counter is a **chain of DFFs** — only the resource table shows how much logic a single `if (counter == N)` line hides.
- The difference between **simulation and silicon** is in timing: Verilator knows nothing about routing, and `setup`/`hold` checks only come after place & route.
- The combinational outputs (`C0`–`C3`) are plain state decoders — simpler and faster than extra registers.

---

## Documentation and code

| Artefact | Location |
| --- | --- |
| LPC1114 assembly report (PDF, 1.9 MB) | [Download](../attachments/ad-converter-assembly/pa-lpc1114-assembly-report.pdf){target=_blank} |
| LPC1114 ADC + multiplexed 7-segment source (10 KB) | [Download](../attachments/ad-converter-assembly/lpc1114-adc-7seg-source.txt){target=_blank} |
| FPGA project: RTL, constraints, Verilator testbench, P&R reports, bitstream (ZIP, 48 KB) | [Download](../attachments/fpga-gowin-verilator/pls-fpga-project-files.zip){target=_blank} |
