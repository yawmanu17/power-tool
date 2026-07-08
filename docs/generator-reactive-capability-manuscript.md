---
title: "Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints"
publication-status: "IEEE-style preprint / technical software paper draft"
software-version: "0.1.0-reactive-capability"
correspondence: "solomon@oforielectricals.com"
keywords:
  - generator reactive capability
  - voltage stability
  - GSU transformer
  - off-nominal tap ratio
  - station-service load
  - transmission planning
  - NERC MOD-025
  - NERC VAR-002
  - web-based engineering software
---

# Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints

Solomon Ofori Manu, ORCID: https://orcid.org/0009-0003-8474-8509

## Abstract

Generator reactive capability is essential for voltage support, transmission transfer capability, and bulk electric system reliability. However, the gross reactive capability shown on a generator capability curve is not always equal to the reactive power that can be delivered to the transmission system. Station-service load, generator step-up (GSU) transformer impedance, off-nominal tap position, scheduled high-side voltage, and generator terminal voltage limits can reduce net reactive power delivery and may create trapped reactive capability. This paper presents a browser-based generator reactive capability screening application and companion MATLAB source appendix for estimating net VAR delivery across GSU tap settings. The method uses a two-bus generator/GSU/infinite-bus equivalent, applies production and absorption voltage schedules, evaluates generator reactive limits, estimates GSU active and reactive losses, and reports net `P2` and `Q2` delivered to the high-side system. The current app implements the workflow in `generator-reactive.html` with modular JavaScript and preserves a cleaned MATLAB version for reproducibility. The contribution is a transparent design-stage screening tool for generator interconnection, voltage-support, and planning-model review before detailed AC power-flow, dynamic stability, excitation limiter, field verification, or NERC compliance studies.

## Index Terms

Generator reactive capability, generator step-up transformer, GSU tap, NERC MOD-025, NERC VAR-002, off-nominal tap ratio, reactive power, transmission planning, voltage schedule, voltage stability.

## Nomenclature

| Symbol | Description | Unit / basis |
| --- | --- | --- |
| `S_base` | Study base power | MVA |
| `P_G` | Gross generator active power | pu |
| `Q_G` | Gross generator reactive power | pu |
| `Q_max` | Generator reactive production limit | pu |
| `Q_min` | Generator reactive absorption limit | pu |
| `P_ssL`, `Q_ssL` | Station-service load on low-voltage side | pu |
| `P_1`, `Q_1` | Net low-side GSU power | pu |
| `P_2`, `Q_2` | Net high-side system delivery | pu |
| `V_1` | Generator terminal voltage | pu |
| `V_2` | Scheduled high-side voltage | pu |
| `V_2,eff` | Tap-adjusted effective high-side voltage | pu |
| `a` | GSU off-nominal tap ratio | pu |
| `R`, `X` | GSU resistance and reactance | pu |
| `Z` | GSU impedance magnitude | pu |
| `phi` | Transformer impedance angle convention | degrees |
| `delta` | Low-side voltage angle relative to high-side bus | degrees |
| `I^2` | Per-unit squared transformer current magnitude | pu |
| `P_loss`, `Q_loss` | GSU active and reactive losses | pu |

## I. Introduction

Synchronous generators support transmission voltage by producing or absorbing reactive power. Planning studies often use generator capability data to represent this voltage-support ability. A capability curve, however, describes gross machine capability at the generator terminals. The net reactive power delivered to the transmission system may be lower because station-service load consumes power, the GSU transformer consumes reactive power, tap settings shift the voltage relationship, and the generator terminal voltage may reach an operating limit.

This distinction matters for voltage stability and transmission planning. If a generator is assumed to deliver more VAR support than it can actually provide at the point of interconnection, a planning model can overstate system voltage margin. Conversely, an unfavorable GSU tap can trap reactive capability inside the generator/transformer interface even though the generator itself appears capable of producing additional Mvar.

This paper upgrades the original generator reactive capability project into an IEEE-style technical software paper and documents the current browser app implementation. The app complements the main OFORI Power Tool but remains separate from the facility power factor correction workflow.

## II. Reliability and Standards Context

The method is standards-aware but not a compliance procedure.

NERC MOD-025-2 addresses verification and data reporting of generator real and reactive power capability and synchronous condenser reactive power capability. Its stated purpose is to ensure that accurate gross and net capability information is available for planning models used to assess Bulk Electric System reliability. NERC VAR-002-4.1 addresses generator operation for maintaining network voltage schedules. These reliability standards motivate the engineering need to distinguish gross generator capability, net delivered capability, voltage schedule, and evidence-based verification.

The app and manuscript do not replace MOD-025 verification, VAR-002 operating requirements, staged testing, historical-data verification, transmission planner forms, excitation limiter studies, or compliance evidence. They provide a design-stage screen that helps engineers identify tap settings and voltage schedules that should receive closer study.

| Review Area | Reference / Practice | App Treatment |
| --- | --- | --- |
| Article structure | IEEE Author Center guidance | Manuscript uses abstract, index terms, nomenclature, methods, equations, results, discussion, conclusion, references. |
| Capability data | NERC MOD-025-2 | Distinguishes gross `Q_G` from net high-side `Q_2`; does not perform compliance verification. |
| Voltage schedule | NERC VAR-002-4.1 | Treats scheduled high-side voltage as a study input; does not issue operating instructions. |
| Planning studies | AC power-flow and voltage-stability practice | Provides a two-bus screening method before full network studies. |
| Generator limits | Capability curve, AVR/excitation limiters | Uses `Q_max`, `Q_min`, `V_hi`, and `V_lo` as user-entered screening constraints. |

## III. Software Implementation

The browser implementation is a static web app:

| Module | File | Purpose |
| --- | --- | --- |
| Browser page | `generator-reactive.html` | Input and output interface for generator/GSU screening |
| Calculation model | `assets/js/generator-model.js` | Two-bus equations, tap loop, production/absorption calculations |
| UI controller | `assets/js/generator-app.js` | Input reading, example loading, result rendering, charting, JSON export |
| MATLAB appendix | `matlab/generator_reactive_capability_screening.m` | Cleaned source derived from the original `.mlx` workflow |
| Shared styling | `assets/css/styles.css` | Consistent interface with OFORI Power Tool |

The app opens blank and includes a `Load Example` button for reproducing the original project case. It reports VAR production, VAR absorption, limiting cases, net Mvar delivered by tap, and a simple review status.

## IV. Input Data Model

The app collects the following inputs.

| Input Group | Data |
| --- | --- |
| Generator | Study base MVA, generator MVA, rated PF, rated MW, `Q_max`, `Q_min`, rated kV, high/low terminal voltage limits |
| System schedule | Connection voltage, production test voltage, absorption test voltage |
| Station service | Low-side station-service MW and Mvar |
| GSU transformer | GSU rating, percent R, percent X, optional X/R ratio |
| Tap study | Comma-separated tap ratios |

If custom production and absorption test voltages are not entered, the app uses the original project schedule:

| Connection voltage | Production schedule | Absorption schedule |
| ---: | ---: | ---: |
| 115 kV | 1.00 pu | 1.03 pu |
| 230 kV | 1.01 pu | 1.04 pu |
| 500 kV | 1.02 pu | 1.05 pu |

## V. Calculation Methods and Equations

All equations below use per-unit quantities on `S_base` unless otherwise stated.

### A. Per-Unit Conversion

```text
P_G = MW_rated / S_base                                                (1)
Q_max,pu = Q_max,Mvar / S_base                                         (2)
Q_min,pu = Q_min,Mvar / S_base                                         (3)
P_ssL,pu = P_ssL,MW / S_base                                           (4)
Q_ssL,pu = Q_ssL,Mvar / S_base                                         (5)
R = percent_R / 100                                                    (6)
X = percent_X / 100                                                    (7)
```

If percent resistance is not entered but `X/R` is known:

```text
R = X / (X/R)                                                          (8)
```

The net low-side active power entering the GSU is:

```text
P_1 = P_G - P_ssL                                                      (9)
```

### B. GSU Impedance Quantities

```text
Z = sqrt(R^2 + X^2)                                                   (10)
phi = atan2(R, X)                                                     (11)
```

The app follows the original project convention in which the tap-adjusted high-side voltage is:

```text
V_2,eff = V_2 / a                                                     (12)
```

This convention must be confirmed against any power-flow tool used for final study work.

### C. Voltage Angle Solution

For a selected tap, starting terminal voltage `V_1`, and effective high-side voltage `V_2,eff`, the app computes:

```text
delta = sin^-1{[Z / (V_1 V_2,eff)] [P_1 - (V_1^2 / Z) sin(phi)]} + phi (13)
```

The low-side reactive power entering the GSU is:

```text
Q_1 = (V_1^2 / Z) cos(phi)
      - [(V_1 V_2,eff) / Z] cos(delta - phi)                          (14)
```

Gross generator reactive output is then:

```text
Q_G = Q_1 + Q_ssL                                                     (15)
```

### D. Reactive Limit Handling

For VAR production:

```text
limited = Q_G > Q_max                                                 (16)
```

For VAR absorption:

```text
limited = Q_G < Q_min                                                 (17)
```

If a case is limited, the app sets:

```text
Q_G = Q_limit                                                         (18)
Q_1 = Q_limit - Q_ssL                                                 (19)
```

and recalculates terminal voltage from:

```text
E_2 = (P_1 X - Q_1 R) / V_2,eff                                       (20)
E_1 = [V_2,eff + sqrt(V_2,eff^2 - 4(E_2^2 - P_1 R - Q_1 X))] / 2       (21)
V_1 = sqrt(E_1^2 + E_2^2)                                             (22)
delta = atan2(E_2, E_1)                                               (23)
```

### E. Transformer Current and Losses

The squared current magnitude is:

```text
I^2 = { [V_1 cos(delta) - V_2,eff]^2 + [V_1 sin(delta)]^2 } / Z^2      (24)
```

Transformer losses are:

```text
Q_loss = I^2 X                                                        (25)
P_loss = I^2 R                                                        (26)
```

### F. Net System Delivery

For low-side station-service load and no high-side station-service load:

```text
Q_2 = Q_G - Q_ssL - Q_loss                                            (27)
P_2 = P_1 - P_loss                                                    (28)
```

If a high-side station-service reactive load is modeled:

```text
Q_2 = Q_G - Q_ssL - Q_loss - Q_ssH                                    (29)
```

The app currently models low-side station-service load because that was the original project case.

### G. Trapped Reactive Capability

For VAR production, a practical trapped-capability indicator is:

```text
Q_trapped = max(Q_max - Q_G, 0)                                       (30)
```

For VAR absorption:

```text
Q_trapped_abs = max(Q_G - Q_min, 0)                                   (31)
```

The app also identifies limited tap cases and highlights where reactive or voltage constraints require review.

### H. Conversion Back to Engineering Units

Reported outputs are converted as:

```text
Q_Mvar = Q_pu S_base                                                  (32)
P_MW = P_pu S_base                                                    (33)
```

## VI. Browser App Workflow

The browser app runs the following sequence:

1. Read generator, GSU, station-service, schedule, and tap inputs.
2. Convert MW/Mvar and impedance values to per-unit.
3. Parse tap ratios.
4. Solve VAR production using the high generator voltage limit.
5. Enforce `Q_max` and recalculate `V_1` for limited cases.
6. Calculate GSU current, losses, `Q_2`, and `P_2`.
7. Solve VAR absorption using the low generator voltage limit.
8. Enforce `Q_min` and recalculate `V_1` for limited cases.
9. Render production and absorption result tables.
10. Plot net Mvar delivery by tap.
11. Export JSON or print the screen for documentation.

## VII. Validation Case

The project example uses:

| Parameter | Value |
| --- | --- |
| Generator rating | 347 MVA |
| Rated PF | 0.85 |
| Rated MW | 295 MW |
| Rated voltage | 18 kV |
| Study base | 100 MVA |
| `Q_max` | 183 Mvar |
| `Q_min` | -100 Mvar |
| GSU rating | 350 MVA maximum |
| GSU impedance | `0.129% + j5.119%` on 100 MVA base |
| Connection voltage | 230 kV |
| Station service | 5.9 MW + j3.54 Mvar low side |
| Voltage limits | 0.95 to 1.05 pu |
| Tap ratios | 1.05, 1.025, 1.00, 0.975, 0.95 |

The app reproduces the original live-script values closely.

### A. VAR Production

| Tap `a` | `V_1` pu | `Q_G` pu | `Q_2` pu | `P_2` pu | Status |
| ---: | ---: | ---: | ---: | ---: | --- |
| 1.050 | 1.0433 | 1.8300 | 1.2501 | 2.8773 | Limited |
| 1.025 | 1.0500 | 1.4909 | 0.9690 | 2.8787 | OK |
| 1.000 | 1.0500 | 0.9824 | 0.5173 | 2.8802 | OK |
| 0.975 | 1.0500 | 0.4480 | 0.0166 | 2.8810 | OK |
| 0.950 | 1.0500 | -0.1144 | -0.5389 | 2.8812 | OK |

### B. VAR Absorption

| Tap `a` | `V_1` pu | `Q_G` pu | `Q_2` pu | `P_2` pu | Status |
| ---: | ---: | ---: | ---: | ---: | --- |
| 1.050 | 0.9500 | -0.5575 | -1.0869 | 2.8786 | OK |
| 1.025 | 0.9506 | -1.0000 | -1.5696 | 2.8775 | Limited |
| 1.000 | 0.9784 | -1.0000 | -1.5397 | 2.8783 | Limited |
| 0.975 | 1.0074 | -1.0000 | -1.5110 | 2.8790 | Limited |
| 0.950 | 1.0378 | -1.0000 | -1.4836 | 2.8797 | Limited |

The best VAR production case is tap `1.05`, with about `125.0 Mvar` net high-side delivery. The strongest VAR absorption case is tap `1.025`, with about `-157.0 Mvar` net high-side delivery. Several cases hit generator reactive limits, which is why the app flags the study as requiring review.

## VIII. Discussion

The results demonstrate that GSU tap position can materially change deliverable reactive power. In the example, several tap settings force the generator to its voltage or reactive limit before full gross capability can be delivered. The screening result is not a replacement for a full AC power-flow model, but it helps identify tap positions and voltage schedules that deserve detailed review.

The browser app adds practical value because it lets engineers vary tap ratios, connection schedules, station-service load, GSU impedance, and generator limits quickly. It also preserves separation between gross generator output and net system delivery. This distinction is aligned with the planning-data emphasis of MOD-025 while remaining outside formal compliance verification.

## IX. Limitations

The app and method do not replace:

- full AC network power-flow studies;
- dynamic voltage stability studies;
- generator capability testing;
- excitation system and limiter studies;
- generator control-mode review;
- relay and protection review;
- interconnection studies;
- MOD-025 or VAR-002 compliance work;
- transmission planner approval.

Other limitations include the two-bus simplification, assumed balanced steady-state operation, low-side station-service assumption, simplified tap convention, no AVR or limiter model, no reactive reserve optimization, and no dynamic response calculation.

## X. Future Work

Future versions may add high-side station-service inputs, automatic per-unit base conversion for transformer MVA bases, CSV import/export, report PDF export, capability curve plotting, AVR/limiter notes, power-flow tool comparison, and integration with broader generator interconnection study templates.

## XI. Conclusion

Generator reactive capability should be evaluated as deliverable system support, not only as gross generator capability. Station-service load, GSU impedance, tap position, voltage schedule, and generator terminal voltage limits can reduce net VAR delivery and create trapped reactive capability. The OFORI Generator Reactive Capability Tool provides a transparent browser-based screening workflow that reproduces the original MATLAB study and supports early design review before full planning, testing, or compliance studies.

## Software Availability

The browser app is maintained in:

- `generator-reactive.html`
- `assets/js/generator-model.js`
- `assets/js/generator-app.js`

The MATLAB source appendix is maintained in:

- `matlab/generator_reactive_capability_screening.m`

## Reproducibility Statement

The example in Section VII can be reproduced by opening `generator-reactive.html` and selecting `Load Example`. The same workflow can be reviewed in the MATLAB appendix. Final validation should compare results against the original project data and a trusted power-flow tool.

## Safety and Compliance Statement

This tool is for screening, design review, education, and documentation. It is not a compliance engine and should not be used as sole evidence for NERC verification, transmission interconnection approval, or generator operating instructions.

## References

[1] IEEE Author Center, "Structure Your Article," IEEE, accessed Jul. 8, 2026. [Online]. Available: https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/create-the-text-of-your-article/structure-your-article/

[2] North American Electric Reliability Corporation, MOD-025-2, *Verification and Data Reporting of Generator Real and Reactive Power Capability and Synchronous Condenser Reactive Power Capability*.

[3] North American Electric Reliability Corporation, VAR-002-4.1, *Generator Operation for Maintaining Network Voltage Schedules*.

[4] P. Kundur, *Power System Stability and Control*. New York, NY, USA: McGraw-Hill, 1994.

[5] Powertech Labs, *Voltage Stability Studies for Southern Company Services*, EPRI TR-109490, Final Report, 1997.

[6] J. D. Gregory and T. A. Higgins, "Parameters Affecting Generating Unit VAR Capability," Electrical Equipment System Committee, Edison Electric Institute, San Diego, CA, USA, Feb. 1983.
