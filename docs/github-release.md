# GitHub Release Text

## Release Title

OFORI Power Tool v1.1.0: Harmonics Screening and Modular Engineering Release

## Description

This release upgrades OFORI Power Tool into a modular static web application for power factor correction, load analysis, cost estimation, and harmonics screening.

### New

- Harmonics inputs for voltage THD, current THD, dominant harmonic order, nonlinear load share, and detuned capacitor bank planning.
- True power factor calculation using distortion factor.
- Harmonic apparent power and transformer K-factor screening estimate.
- Clear technical separation between displacement PF, true PF, reactive power, and harmonic distortion.
- Modular files under `assets/css` and `assets/js`.
- Printable report view that reads the saved calculator state.
- Release and publication documentation for GitHub, Zenodo, OSF, Figshare, and scholarly use.
- Software paper package documenting the original program, current app, equations, standards-aware review, validation examples, limitations, and platform submission text.

### Notes

The tool is intended for screening and communication. Final equipment sizing should be verified with site measurements and current utility or power-quality requirements.

For manuscript release, include `docs/paper-manuscript.md`, `docs/paper-publication-packet.md`, `docs/paper-platform-submissions.md`, and `docs/paper-release-notes.md`.

For the companion generator reactive capability paper, include `docs/generator-reactive-capability-manuscript.md`, `docs/generator-reactive-capability-publication-packet.md`, `docs/generator-reactive-capability-platform-submissions.md`, and `docs/generator-reactive-capability-release-notes.md`.
