# Release Notes: Generator Reactive Capability Paper v0.1.0

## Summary

Version 0.1.0 adds and refines the "Generator Reactive Capability Requirement" project as a companion power-systems publication and browser screening tool in the OFORI Power Tool repository.

## Highlights

- Converts the original class/project document into an IEEE-style technical software manuscript.
- Clarifies the difference between gross generator reactive capability and net VAR delivery to the transmission system.
- Adds design-stage framing for station-service load, GSU transformer impedance, tap position, voltage schedule, and generator terminal voltage limits.
- Adds NERC MOD-025 and VAR-002 context without claiming compliance automation.
- Adds Index Terms, Nomenclature, numbered calculation equations, validation tables, software availability, reproducibility, and safety/compliance statements.
- Adds publication packet and platform submission text for Zenodo, Figshare, OSF, ResearchGate, and journal cover letters.
- Adds a cleaned MATLAB source appendix from the supplied `.mlx` workflow.
- Adds a browser-based generator reactive capability app page similar to the main power tool.

## Recommended Release Tag

generator-var-paper-v0.1.0

## Suggested GitHub Release Title

Generator Reactive Capability Paper v0.1.0: Net VAR Delivery and GSU Tap Screening

## Suggested DOI Title

Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints

## Suggested GitHub Release Body

This release adds a refined technical manuscript package and browser screening app for generator reactive capability. The paper presents a two-bus generator/GSU/infinite-bus model for evaluating how station-service load, GSU impedance, tap position, voltage schedule, and generator terminal limits affect net reactive power delivery to the transmission system.

The package includes:

- IEEE-style manuscript draft with formulas and validation tables.
- Publication packet.
- Platform submission text.
- Release notes.
- Browser app files.
- MATLAB source appendix.
- Claim-boundary guidance separating screening from compliance verification.

## Limitations

The manuscript is a screening and design-review method. It does not replace AC power-flow studies, dynamic stability analysis, generator testing, excitation limiter studies, interconnection studies, NERC compliance verification, or transmission planner approval.

## Recommended Files To Include In A Release

- `docs/generator-reactive-capability-manuscript.md`
- `docs/generator-reactive-capability-publication-packet.md`
- `docs/generator-reactive-capability-platform-submissions.md`
- `docs/generator-reactive-capability-release-notes.md`
- `generator-reactive.html`
- `assets/js/generator-model.js`
- `assets/js/generator-app.js`
- `matlab/generator_reactive_capability_screening.m`
