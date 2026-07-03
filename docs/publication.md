# Publication Write-Up

## Title

OFORI Power Tool: A Browser-Based Calculator for Power Factor Correction, Load Analysis, Cost Estimation, and Harmonics Screening

## Abstract

OFORI Power Tool is a lightweight web application for preliminary electrical load analysis, power factor correction, energy cost estimation, and harmonics screening. The tool accepts common field inputs such as kW, kVA, power factor, current, voltage, operating schedule, and utility rates. It calculates real power, reactive power, apparent power, displacement power factor, estimated line current, capacitor compensation requirements, monthly cost impacts, and simple payback. The enhanced version adds harmonic screening inputs for voltage total harmonic distortion, current total harmonic distortion, dominant harmonic order, nonlinear load share, and detuned capacitor bank planning. Results distinguish displacement power factor from true power factor, supporting better communication between utility billing analysis, capacitor sizing, and power-quality mitigation.

## Keywords

power factor correction; harmonics; power quality; capacitor bank sizing; energy cost; load analysis; web-based engineering tool

## Software Availability Statement

The software is available as a static browser application and may be hosted on GitHub Pages or any static web server. Source code, citation metadata, release notes, and publication platform write-ups are included in the repository.

## Methods Summary

The application computes fundamental power quantities from user-selected load input modes. Total real and reactive power are summed across loads, and total apparent power is calculated from the power triangle. Capacitor compensation is sized from the difference between present reactive power and the target reactive power corresponding to the selected displacement power factor. Harmonics screening applies current THD to estimate distortion factor, true power factor, harmonic apparent power, and transformer K-factor exposure. The harmonic assessment is a screening method and should be verified with field measurements for final design.

## Recommended Citation

Ofori Manu, S. (2026). OFORI Power Tool: Power Factor Correction and Harmonics Analysis (Version 1.1.0) [Software]. GitHub.
