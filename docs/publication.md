# Publication Write-Up

## Title

OFORI Power Tool: A Browser-Based Engineering Screening Application for Power Factor Correction, Harmonics, and Standards-Aware Load Review

## Abstract

OFORI Power Tool is a browser-based engineering screening application for preliminary electrical load analysis, power factor correction, energy cost estimation, harmonics screening, and standards-aware review. The current app supports single-phase and three-phase studies, LV/MV voltage selection, 50/60 Hz operation, motor horsepower input, kW + PF, kVA + PF, kW + kVAr, current + PF, demand factor, efficiency, utility rates, voltage THD, current THD, dominant harmonic order, nonlinear load share, detuned capacitor bank indication, charts, JSON export, and printable report output. It calculates real power, reactive power, apparent power, displacement power factor, true power factor, estimated line current, capacitor compensation, corrected apparent power, capacitance, monthly cost impact, harmonic apparent power, transformer K-factor exposure, and review prompts. Results distinguish displacement power factor from true power factor and separate capacitor correction from harmonic mitigation.

## Keywords

power factor correction; harmonics; power quality; capacitor bank sizing; energy cost; load analysis; IEEE 519; IEC 61000; NEC; web-based engineering tool

## Software Availability Statement

The software is available as a static browser application and may be hosted on GitHub Pages or any static web server. Source code, citation metadata, release notes, and publication platform write-ups are included in the repository.

## Methods Summary

The application computes fundamental power quantities from user-selected load input modes including motor HP, kW + PF, kVA + PF, kW + kVAr, and current + PF. The upgraded manuscript in `docs/paper-manuscript.md` now gives IEEE-style numbered formulas for demand factor, efficiency, load conversion, total power triangle values, line current, target PF correction, capacitance, economics, distortion factor, true PF, harmonic apparent power, harmonic current, and K-factor screening. Standards-aware screening classifies voltage, checks 50/60 Hz basis, flags nonlinear and capacitor-bank review needs, and directs the user toward IEC, NEC/NFPA 70, IEEE, utility, and manufacturer requirements. The harmonic and standards assessments are screening methods and should be verified with field measurements for final design.

## Full Paper Package

- `docs/paper-manuscript.md`
- `docs/paper-publication-packet.md`
- `docs/paper-platform-submissions.md`
- `docs/paper-release-notes.md`

## Companion Power-Systems Paper

The repository also includes a refined companion manuscript on generator reactive capability screening:

- `docs/generator-reactive-capability-manuscript.md`
- `docs/generator-reactive-capability-publication-packet.md`
- `docs/generator-reactive-capability-platform-submissions.md`
- `docs/generator-reactive-capability-release-notes.md`

## Recommended Citation

Ofori Manu, S. (2026). OFORI Power Tool: Power Factor Correction, Harmonics, and Standards-Aware Load Review (Version 1.1.0) [Software]. GitHub.
