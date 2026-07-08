# Paper Publication Packet

## Manuscript Title

OFORI Power Tool: A Browser-Based Engineering Screening Application for Power Factor Correction, Harmonics, and Standards-Aware Load Review

## Short Title

OFORI Power Tool for Power Factor Correction, Harmonics, and Load Review

## Manuscript Status

Preprint / software paper draft

## Recommended Version

v1.1.0-paper

## Suggested Repository Release Title

OFORI Power Tool Paper Package v1.1.0: Power Factor Correction, Harmonics, and Standards-Aware Load Review

## Suggested DOI Title

OFORI Power Tool: Browser-Based Power Factor Correction, Load Analysis, and Harmonics Screening Software

## Author

Solomon Ofori Manu  
Electrical Engineer / Independent Researcher  
ORCID: https://orcid.org/0009-0003-8474-8509

## Abstract

OFORI Power Tool is a browser-based engineering screening application for preliminary electrical load analysis, power factor correction, harmonics screening, economics, report generation, and standards-aware review. The current app supports single-phase and three-phase studies, LV/MV voltage selection, 50/60 Hz operation, motor horsepower input, kW + PF, kVA + PF, kW + kVAr, current + PF, demand factor, efficiency, utility rates, voltage THD, current THD, nonlinear load share, dominant harmonic order, detuned capacitor bank indication, charts, JSON export, and printable report output. It calculates real, reactive, and apparent power; displacement power factor; true power factor; line current; capacitor compensation; capacitance; cost impact; harmonic apparent power; transformer K-factor exposure; and review prompts. The contribution is a transparent static web tool for early-stage engineering screening before measured studies, code review, manufacturer selection, or final design.

## Keywords

power factor correction; harmonics; power quality; capacitor bank sizing; load analysis; electrical engineering software; IEC 61000; IEEE 519; NEC; web application

## Core Contribution

The paper updates the original "Design program for Power Factor Correction and Load Analysis" into an IEEE-style applied software manuscript documenting the current modular browser app, formulas, validation case, harmonics method, standards-aware boundaries, limitations, and reproducibility.

## Claim Boundary

Use this language consistently:

- The app provides preliminary engineering screening estimates.
- The app supports standards-aware review but does not certify compliance.
- The app distinguishes displacement PF from true PF.
- Capacitor correction is treated separately from harmonic mitigation.
- Final design requires measured site data, utility requirements, manufacturer data, current standards, and qualified engineering review.

## Recommended Manuscript Sections

1. Title and author block.
2. Abstract.
3. Index Terms.
4. Nomenclature.
5. I. Introduction.
6. II. Industry Standards and Review Context.
7. III. Software Architecture.
8. IV. Input Data Model.
9. V. Calculation Methods and Equations.
10. VI. Standards-Aware App Logic.
11. VII. Results and Validation Case.
12. VIII. Discussion.
13. IX. Limitations.
14. X. Future Work.
15. XI. Conclusion.
16. Software Availability.
17. Reproducibility Statement.
18. Safety and Ethics Statement.
19. IEEE-numbered References.

## Recommended Figures

| Figure | Purpose |
| --- | --- |
| App architecture diagram | Shows static HTML/CSS/JS modules and report flow. |
| Input workflow | Shows System, Loads, Correction, Economics, Harmonics tabs. |
| Power triangle before/after correction | Explains displacement PF correction. |
| Harmonic waveform illustration | Explains distortion and true PF. |
| Standards-aware screening flow | Shows how app flags review items without claiming compliance. |
| Example report output | Demonstrates reproducibility and communication value. |

## Recommended Tables

| Table | Purpose |
| --- | --- |
| Load input modes | Maps nameplate data to equations. |
| Equation set | Lists numbered equations for demand, load modes, PF correction, economics, harmonics, and K-factor screening. |
| Output distinctions | Separates kW, kVAr, kVA, displacement PF, true PF, correction kVAr, harmonic kVA. |
| Standards alignment | Maps IEC, NEC/NFPA 70, and IEEE review areas to app prompts. |
| Validation cases | Compares hand calculations with app output. |
| Limitations | Lists what the app does not replace. |

## Standards Alignment Table

| Area | Reference Framework | App Treatment |
| --- | --- | --- |
| Nominal voltage basis | IEC 60038 | Preferred LV/MV voltage quick-list and voltage-class review. |
| Harmonic emissions | IEC 61000-3-2 and IEC 61000-3-12 | Product-scope prompts based on current range. |
| Harmonic measurement | IEC 61000-4-7 | Identified as measurement/study reference for harmonics. |
| Facility harmonic planning | IEEE 519 | Used as external PCC study reference, not reproduced as full limit tables. |
| Installation review | NEC/NFPA 70 | Prompts for motors, transformers, capacitors, protection, disconnecting, and local authority review. |
| Capacitor application | NEC/NFPA 70 and manufacturer standards | Flags discharge, overcurrent protection, switching, enclosure, SCCR, and resonance review. |

## Formula Coverage

The manuscript now includes IEEE-style numbered equations for:

- demand and efficiency factors;
- motor HP + efficiency + PF;
- kW + PF;
- kVA + PF;
- kW + kVAr;
- current + PF for single-phase and three-phase systems;
- aggregate power triangle quantities;
- line current;
- target displacement PF correction;
- capacitor kVAr and capacitance;
- monthly energy/reactive economics;
- distortion factor and true PF;
- harmonic apparent power;
- harmonic current;
- K-factor screening.

## Standards Source Check

Use official standards pages for final manuscript verification. Do not reproduce protected standard tables unless the target venue and copyright rules allow it.

| Reference | Official Source |
| --- | --- |
| IEC 60038:2009, standard voltages | https://webstore.iec.ch/en/publication/153 |
| IEC 61000-3-2:2018, harmonic current emissions <=16 A per phase | https://webstore.iec.ch/en/publication/28164 |
| IEC 61000-4-7, harmonics and interharmonics measurement guidance | https://webstore.iec.ch/en/publication/4225 |
| IEEE 519-2022, harmonic control in electric power systems | https://standards.ieee.org/ieee/519/10684/ |
| NFPA 70, National Electrical Code | https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70 |

## Best-Fit Venues

- IEEE engineering education, industry applications, or software demonstration venues.
- MDPI Software, Energies, Electricity, or Engineering Proceedings.
- Figshare or Zenodo as software plus manuscript package.
- OSF as a working-paper and reproducibility record.
- ResearchGate as a working paper for engineering feedback.
- Engineering education or electrical contracting technical bulletins.

## Recommended Citation

Ofori Manu, S. (2026). *OFORI Power Tool: Browser-Based Power Factor Correction, Load Analysis, and Harmonics Screening Software* (Version 1.1.0) [Software and preprint package].

## Submission Readiness Checklist

- [ ] Include screenshots of the System, Loads, Correction, Harmonics, Standards, and Report views.
- [ ] Add one single-phase validation case and one three-phase validation case.
- [x] Add IEEE-style structure and numbered equations.
- [x] Add a standards-alignment table with clear claim boundaries.
- [ ] Confirm current standard editions before journal submission.
- [ ] Avoid copying standard tables unless permission or fair-use quotation limits are reviewed.
- [ ] Add repository URL, project page URL, and software version.
- [ ] Include license and citation metadata.
- [ ] Verify that the app examples do not imply final design approval.
