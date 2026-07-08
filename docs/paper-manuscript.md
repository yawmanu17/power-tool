---
title: "OFORI Power Tool: A Browser-Based Engineering Screening Application for Power Factor Correction, Harmonics, and Standards-Aware Load Review"
publication-status: "IEEE-style preprint / software paper draft"
software-version: "1.1.0"
correspondence: "solomon@oforielectricals.com"
keywords:
  - power factor correction
  - harmonics
  - power quality
  - capacitor bank sizing
  - load analysis
  - IEEE 519
  - IEC 61000
  - NEC
  - electrical engineering software
---

# OFORI Power Tool: A Browser-Based Engineering Screening Application for Power Factor Correction, Harmonics, and Standards-Aware Load Review

Solomon Ofori Manu, ORCID: https://orcid.org/0009-0003-8474-8509

## Abstract

Power factor correction, load estimation, and harmonic screening are frequently performed with spreadsheets, hand calculations, or isolated scripts that do not clearly separate fundamental reactive power from waveform distortion. This paper presents OFORI Power Tool, a browser-based engineering screening application for preliminary power factor correction, load analysis, harmonics assessment, economics, and standards-aware review. The current application supports single-phase and three-phase studies, LV/MV voltage selection, 50/60 Hz operation, motor horsepower input, kW + PF, kVA + PF, kW + kVAr, current + PF, demand factor, efficiency, utility rates, voltage THD, current THD, nonlinear load share, dominant harmonic order, detuned capacitor bank indication, charts, JSON export, and a printable report view. The calculation model estimates real power, reactive power, apparent power, displacement power factor, true power factor, line current, capacitor compensation, capacitance, cost impact, harmonic apparent power, transformer K-factor exposure, and standards review prompts. The contribution is a transparent static web tool that helps engineers, electricians, students, and facility operators perform early-stage screening before measured studies, code review, manufacturer selection, or final engineering design.

## Index Terms

Capacitor bank sizing, distortion factor, harmonics, IEEE 519, IEC 61000, load analysis, power factor correction, power quality, standards-aware screening, web-based engineering software.

## Nomenclature

| Symbol | Description | Unit |
| --- | --- | --- |
| `P` | Real power | kW |
| `Q` | Fundamental reactive power | kVAr |
| `S` | Apparent power from the fundamental power triangle | kVA |
| `D` | Harmonic/distortion apparent power estimate | kVA |
| `V` | RMS voltage, line-neutral for single-phase or line-line for three-phase | V |
| `I` | RMS line current | A |
| `PF_d` | Displacement power factor | pu |
| `PF_t` | True power factor estimate | pu |
| `DF` | Distortion factor | pu |
| `THD_i` | Current total harmonic distortion | % |
| `THD_v` | Voltage total harmonic distortion | % |
| `Q_c` | Capacitor reactive compensation | kVAr |
| `C` | Capacitance estimate | F |
| `f` | System frequency | Hz |
| `h` | Harmonic order | integer |

## I. Introduction

Power factor correction is widely used to reduce unnecessary reactive demand, improve utilization of electrical distribution capacity, support voltage quality, and reduce avoidable billing penalties. In classical sinusoidal analysis, low displacement power factor is corrected by supplying capacitive reactive power. In modern industrial and commercial facilities, however, nonlinear loads such as variable-frequency drives, rectifiers, LED drivers, electronic power supplies, welders, and switched-mode equipment can make power-quality review more complex. A capacitor bank selected only from a fundamental power triangle may be unsuitable where harmonic distortion and resonance risk are significant.

The original OFORI power factor project focused on calculating load parameters and capacitor bank sizes. The current OFORI Power Tool extends that foundation into a modular browser-based application. It now distinguishes single-phase and three-phase systems, uses one selected load-supply voltage for load-current calculations, supports practical industrial nameplate inputs, separates displacement PF from true PF, adds harmonics screening, provides power-triangle and waveform visualizations, generates report-ready results, and provides standards-aware review prompts.

This paper follows an IEEE-style technical structure: introduction, methods, equations, results, discussion, limitations, conclusion, and references. The intent is not to claim final standards compliance. The app provides transparent screening calculations and directs users toward measured field studies, manufacturer data, applicable standards, local code requirements, utility rules, and qualified professional review.

## II. Industry Standards and Review Context

The app is designed as a standards-aware screening tool, not a standards-compliance engine. It references current industry review frameworks as follows.

| Review Area | Reference Framework | App Treatment |
| --- | --- | --- |
| IEEE article structure | IEEE Author Center guidance | Manuscript organized around title, abstract, keywords, introduction, methodology, equations, results, discussion, conclusion, references. |
| Harmonic planning at PCC | IEEE Std 519-2022 | Flags need for facility/PCC harmonic study where current distortion or nonlinear load share is elevated. |
| Harmonic emissions up to 16 A/phase | IEC 61000-3-2:2018 | Prompts product/emission review for low-current equipment categories. |
| Harmonic emissions above 16 A and up to 75 A/phase | IEC 61000-3-12 | Prompts conditional product/emission review for applicable equipment. |
| Harmonic/interharmonic measurement | IEC 61000-4-7 | Identified as measurement reference for verified harmonic studies. |
| Nominal voltage basis | IEC 60038 | Uses preferred LV/MV voltage options as quick-list values. |
| Installation and safety review | NEC/NFPA 70 | Prompts review for motors, transformers, capacitors, conductors, overcurrent protection, disconnecting means, equipment ratings, and authority having jurisdiction. |

The app avoids reproducing protected standard tables and does not attempt to certify compliance. For publication, standards language should remain at the level of review scope, calculation boundary, and engineering workflow.

## III. Software Architecture

OFORI Power Tool is implemented as a static browser application. It can run locally or from a static host such as GitHub Pages. The architecture is intentionally simple for reproducibility.

| Module | File | Function |
| --- | --- | --- |
| Main application view | `index.html` | User interface for load, correction, economics, harmonics, and standards review |
| Report view | `powerbill.html` | Printable/synchronized report output |
| Calculation engine | `assets/js/power-model.js` | Load, correction, economics, and harmonics calculations |
| Standards screen | `assets/js/standards-model.js` | Voltage class, equipment, capacitor, and harmonic review prompts |
| Charts | `assets/js/charts.js` | Power triangles, costs, harmonic waveform, and result visuals |
| UI controller | `assets/js/app.js` | Input state, load cards, tabs, events, rendering |
| Reporting | `assets/js/reporting.js` | Summary text, formatting, report state |
| Storage/export | `assets/js/storage.js` | Local state and JSON export |
| Styling | `assets/css/styles.css` | Responsive engineering interface |

The input workflow is organized into five tabs: System, Loads, Correction, Economics, and Harmonics. Results are organized into summary metrics, load tables, correction outputs, harmonic indicators, standards review, charts, and report text.

## IV. Input Data Model

The current app avoids preloaded values and placeholders. Users select or enter the data required for the study.

| Input Section | Engineering Data |
| --- | --- |
| System | Single-phase/three-phase, load supply voltage, frequency, study purpose, standards basis |
| Loads | Equipment type, nameplate method, motor HP, kW, kVA, kVAr, current, PF, efficiency, demand factor |
| Correction | Target displacement PF, capacitor cost |
| Economics | Energy rate, reactive rate, hours/day, days/month |
| Harmonics | Voltage THD, current THD, dominant harmonic order, nonlinear load share, detuned capacitor bank indication |

The system voltage is intentionally treated as the load supply voltage for all load-current calculations. Single-phase studies use line-neutral or single-phase RMS voltage. Three-phase studies use line-line RMS voltage.

## V. Calculation Methods and Equations

This section gives the equations in a form suitable for an IEEE-style manuscript. Quantities are expressed in kW, kVAr, kVA, volts, amperes, and per-unit power factor unless otherwise stated.

### A. Demand and Efficiency Factors

For load methods with a demand factor, the app applies:

```text
d = demand_percent / 100                                                (1)
```

For motor horsepower input, efficiency is:

```text
eta = efficiency_percent / 100                                          (2)
```

### B. Motor Horsepower Input

For a motor load entered by horsepower, efficiency, and PF:

```text
P = HP x 0.746 x d / eta                                                (3)
S = P / PF                                                              (4)
Q = sqrt(S^2 - P^2)                                                     (5)
```

This method is useful for quick nameplate screening. Final motor branch-circuit and protection design must follow applicable installation codes and motor standards.

### C. kW + PF Input

For a load entered as real power and PF:

```text
P = P_input x d                                                         (6)
S = P / PF                                                              (7)
Q = sqrt(S^2 - P^2)                                                     (8)
```

### D. kVA + PF Input

For apparent power and PF:

```text
S = S_input x d                                                         (9)
P = S x PF                                                             (10)
Q = sqrt(S^2 - P^2)                                                    (11)
```

### E. kW + kVAr Input

For real and reactive power:

```text
P = P_input x d                                                        (12)
Q = Q_input x d                                                        (13)
S = sqrt(P^2 + Q^2)                                                    (14)
PF_d = P / S                                                           (15)
```

### F. Current + PF Input

For single-phase systems:

```text
S = V I / 1000                                                         (16)
```

For three-phase systems:

```text
S = sqrt(3) V_LL I / 1000                                              (17)
```

Then:

```text
P = S x PF                                                             (18)
Q = sqrt(S^2 - P^2)                                                    (19)
```

### G. Aggregate Load Quantities

For `n` loads:

```text
P_T = sum(P_i), i = 1...n                                              (20)
Q_T = sum(Q_i), i = 1...n                                              (21)
S_T = sqrt(P_T^2 + Q_T^2)                                              (22)
PF_d = P_T / S_T                                                       (23)
phi = cos^-1(PF_d)                                                     (24)
```

Estimated line current is:

```text
I_1phi = S_T x 1000 / V                                                (25)
I_3phi = S_T x 1000 / (sqrt(3) V_LL)                                   (26)
```

The app reports these as screening currents, not conductor ampacity or protection settings.

### H. Capacitor Correction for Target Displacement PF

Capacitor correction is based on displacement PF, not true PF. Given a target `PF_target`:

```text
theta_1 = atan2(Q_T, P_T)                                              (27)
theta_2 = cos^-1(PF_target)                                            (28)
Q_target = P_T tan(theta_2)                                            (29)
Q_c = max(Q_T - Q_target, 0)                                           (30)
Q_corrected = Q_T - Q_c                                                (31)
S_corrected = sqrt(P_T^2 + Q_corrected^2)                              (32)
PF_corrected = P_T / S_corrected                                      (33)
```

The capacitance estimate is:

```text
C_total = Q_c x 1000 / (2 pi f V^2)                                   (34)
```

For a three-phase quick screen, the app reports:

```text
C_phase = C_total / 3                                                  (35)
```

This is a planning indication only. Final capacitor bank sizing must account for connection type, rated voltage, kvar step size, switching duty, discharge means, overcurrent protection, enclosure rating, short-circuit current rating, harmonic resonance, and manufacturer data.

### I. Economic Screening

Monthly operating hours are:

```text
H_m = hours_per_day x days_per_month                                  (36)
```

Energy and reactive quantities are:

```text
E_kWh = P_T x H_m                                                      (37)
E_kVArh = Q_T x H_m                                                    (38)
Cost_energy = E_kWh x rate_kWh                                        (39)
Cost_reactive = E_kVArh x rate_kVArh                                  (40)
```

The app estimates reactive savings from the correction kvar:

```text
Savings_reactive = Q_c x H_m x rate_kVArh                             (41)
```

It also includes a small loss-savings screening term:

```text
Savings_loss = (Q_T - Q_corrected) x H_m x rate_kVArh x 0.06           (42)
Savings_monthly = Savings_reactive + Savings_loss                     (43)
Payback_months = installed_cost / Savings_monthly                     (44)
```

This is a communication estimate and should be replaced by utility tariff-specific calculations for investment decisions.

### J. Harmonic Distortion and True PF Screening

Current THD is entered as a percent. The app estimates distortion factor:

```text
DF = 1 / sqrt(1 + (THD_i / 100)^2)                                    (45)
```

True PF is estimated as:

```text
PF_t = PF_d x DF                                                       (46)
```

Total RMS apparent power is estimated as:

```text
S_rms = S_T / DF                                                       (47)
```

Harmonic apparent power estimate:

```text
D = sqrt(S_rms^2 - S_T^2)                                             (48)
```

Harmonic current estimate:

```text
I_h = I x THD_i / 100                                                  (49)
```

The app distributes harmonic exposure across selected orders for visualization and K-factor screening. If `I_h/I_1` is represented by order percentages:

```text
K = sum((I_h / I_1)^2 h^2)                                             (50)
```

The K-factor value is a screening indicator only. Transformer selection or derating must be based on manufacturer data and measured harmonic spectra.

### K. Harmonic Risk Score

The app classifies harmonic risk using conservative screen rules:

```text
score = f(THD_v, THD_i, nonlinear_share, detuned_bank, dominant_order) (51)
```

Risk levels are:

```text
Low: routine verification
Watch: check capacitor resonance and nonlinear sources
High: detailed harmonic study and detuned/filtered correction review
```

This risk classification is intentionally simple. It is a triage aid before formal IEEE 519 or utility PCC evaluation.

## VI. Standards-Aware App Logic

The standards module performs a practical review rather than a compliance decision.

| Screen | Logic |
| --- | --- |
| Voltage class | ELV, LV, MV, HV by selected kV |
| Preferred voltage | Compares selected kV with app quick-list values |
| Frequency | Flags non-50/60 Hz selections |
| Harmonics | Screens `THD_v`, `THD_i`, nonlinear load share, dominant order |
| Capacitors | Flags resonance and protection review where correction is requested |
| Motors | Prompts NEC Article 430 / IEC motor data review, as applicable |
| Transformers | Prompts transformer loading, impedance, thermal, and K-factor review |
| Drives | Prompts harmonic, EMC, grounding, cable, and motor-insulation review |
| Installation | Prompts SCCR, interrupting rating, grounding, enclosure, and AHJ review |

The phrase "standards-aware" means that the app tells the user what to review. It does not calculate every clause, table, exception, or product classification in NEC, IEC, or IEEE standards.

## VII. Results and Validation Case

The app was checked against a simple motor case to verify phase-current distinctions.

Given:

```text
HP = 10
eta = 0.90
PF = 0.85
d = 1.00
```

From (3)-(5):

```text
P = 10 x 0.746 / 0.90 = 8.29 kW
S = 8.29 / 0.85 = 9.75 kVA
Q = sqrt(9.75^2 - 8.29^2) = 5.14 kVAr
```

At 230 V single-phase:

```text
I = 9.75 x 1000 / 230 = 42.40 A
```

At 415 V three-phase:

```text
I = 9.75 x 1000 / (sqrt(3) x 415) = 13.57 A
```

This result confirms that the current model distinguishes single-phase and three-phase voltage bases and uses the selected load supply voltage consistently.

## VIII. Discussion

The current app is stronger than the original power-factor program in four important ways. First, it matches field data entry more closely by accepting motor HP, efficiency, demand factor, current, kW, kVA, kVAr, and PF. Second, it separates displacement PF correction from true PF and harmonic distortion. Third, it includes industry review prompts for equipment categories rather than presenting a capacitor value as a final design. Fourth, it provides reproducible browser-based documentation through charts, tables, report view, and JSON export.

The most important engineering distinction is that capacitor correction reduces fundamental reactive power but does not, by itself, correct harmonic distortion. Where current THD and nonlinear load share are significant, standard capacitors may amplify resonance conditions. The app therefore treats capacitor correction and harmonic mitigation as related but separate tasks.

## IX. Limitations

The app does not replace:

- measured load and power-quality studies;
- IEEE 519 PCC harmonic assessment;
- IEC product emission testing;
- NEC/NFPA 70 installation design;
- conductor ampacity and voltage-drop calculations;
- short-circuit and protection coordination studies;
- arc-flash studies;
- capacitor bank manufacturer design;
- utility interconnection or tariff review;
- professional engineering approval.

The app also assumes balanced three-phase quantities and does not yet calculate unbalance, neutral harmonic current, detailed harmonic spectra, resonance frequency, capacitor switching transients, or transformer thermal derating.

## X. Future Work

Future releases may add:

- CSV import/export test cases;
- measured waveform or meter-data import;
- IEEE 519 table-guided PCC screening;
- IEC product-class workflow prompts;
- capacitor resonance frequency screening;
- neutral triplen harmonic screening;
- per-phase unbalance;
- transformer derating guidance;
- PDF report export;
- integration between facility PF correction and the companion generator reactive capability tool.

## XI. Conclusion

OFORI Power Tool provides a practical browser-based screening workflow for power factor correction, load analysis, harmonics, cost estimation, and standards-aware review. The app is best understood as an engineering communication and early-stage screening tool. It makes classical equations easier to use while also reflecting modern industry concerns such as nonlinear loads, true PF, harmonic risk, capacitor resonance, LV/MV voltage class, equipment review, and report-ready documentation. Final design decisions must still be verified with measured data, applicable standards, manufacturer information, utility rules, and qualified professional judgment.

## Software Availability

The software is maintained as a static web application in the OFORI Power Tool repository. Main files include:

- `index.html`
- `powerbill.html`
- `assets/js/power-model.js`
- `assets/js/standards-model.js`
- `assets/js/charts.js`
- `assets/js/app.js`
- `assets/css/styles.css`

The companion generator reactive capability tool is maintained separately at `generator-reactive.html`.

## Reproducibility Statement

The browser app runs locally and uses user-provided inputs. The validation case in Section VII can be reproduced by entering the listed motor, voltage, phase, and PF values. No external server or proprietary runtime is required for the power-factor and harmonics calculations.

## Safety and Ethics Statement

No human or animal subjects are involved. The primary safety consideration is misuse of screening results as final design. The software and manuscript explicitly require confirmation against measured data, current standards, utility requirements, manufacturer instructions, and qualified professional review.

## References

[1] IEEE Author Center, "Structure Your Article," IEEE, accessed Jul. 8, 2026. [Online]. Available: https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/create-the-text-of-your-article/structure-your-article/

[2] IEEE Std 519-2022, *IEEE Recommended Practice and Requirements for Harmonic Control in Electric Power Systems*, IEEE, 2022.

[3] International Electrotechnical Commission, IEC 60038:2009, *IEC Standard Voltages*, IEC, Geneva, Switzerland, 2009.

[4] International Electrotechnical Commission, IEC 61000-3-2:2018, *Electromagnetic Compatibility (EMC) - Part 3-2: Limits - Limits for Harmonic Current Emissions (Equipment Input Current <=16 A Per Phase)*, IEC, Geneva, Switzerland, 2018.

[5] International Electrotechnical Commission, IEC 61000-3-12, *Electromagnetic Compatibility (EMC) - Limits for Harmonic Currents Produced by Equipment Connected to Public Low-Voltage Systems With Input Current >16 A and <=75 A Per Phase*, IEC, Geneva, Switzerland.

[6] International Electrotechnical Commission, IEC 61000-4-7, *Testing and Measurement Techniques - General Guide on Harmonics and Interharmonics Measurements and Instrumentation*, IEC, Geneva, Switzerland.

[7] NFPA 70, *National Electrical Code*, National Fire Protection Association, locally adopted edition.

[8] C. A. Gross, *Power System Analysis*, 2nd ed. New York, NY, USA: Wiley, 1986.

[9] IEEE Std 141-1986, *IEEE Recommended Practice for Electric Power Distribution for Industrial Plants*, IEEE, 1986.

[10] IEEE Std 399-1990, *IEEE Recommended Practice for Industrial and Commercial Power Systems Analysis*, IEEE, 1990.
