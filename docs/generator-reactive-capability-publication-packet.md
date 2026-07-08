# Generator Reactive Capability Publication Packet

## Manuscript Title

Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints

## Short Title

Generator Reactive Capability Screening

## Manuscript Status

IEEE-style preprint / technical software paper draft

## Recommended Version

0.1.0-reactive-capability

## Suggested Repository Release Title

Generator Reactive Capability Paper v0.1.0: Net VAR Delivery and GSU Tap Screening

## Suggested DOI Title

Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints

## Author

Solomon Ofori Manu  
Electrical Engineer / Independent Researcher  
ORCID: https://orcid.org/0009-0003-8474-8509

## Abstract

Generator reactive capability is essential for voltage support, transmission transfer capability, and bulk electric system reliability. However, the gross reactive capability shown on a generator capability curve is not always equal to the reactive power that can be delivered to the transmission system. Station-service load, generator step-up transformer impedance, off-nominal tap position, scheduled high-side voltage, and generator terminal voltage limits can reduce net reactive power delivery and may create trapped reactive capability. This paper presents a browser-based generator reactive capability screening application and companion MATLAB source appendix for estimating net VAR delivery across GSU tap settings. The method uses a two-bus generator/GSU/infinite-bus equivalent, applies production and absorption voltage schedules, evaluates generator reactive limits, estimates GSU active and reactive losses, and reports net `P2` and `Q2` delivered to the high-side system. The contribution is a transparent design-stage screening tool for generator interconnection, voltage-support, and planning-model review before detailed AC power-flow, dynamic stability, excitation limiter, field verification, or NERC compliance studies.

## Keywords

generator reactive capability; voltage stability; GSU transformer; off-nominal tap ratio; station-service load; NERC MOD-025; NERC VAR-002; transmission planning; web-based engineering software

## Core Contribution

The paper refines the academic project into a defensible engineering manuscript and working browser tool. It focuses on the difference between gross generator VAR capability and net VAR support delivered to the transmission system, with tap-by-tap production and absorption screening.

## Claim Boundary

Use this language consistently:

- This is a screening and design-review method.
- It does not replace full power-flow, dynamic stability, excitation limiter, generator testing, or NERC compliance studies.
- It supports early review of GSU tap settings, voltage schedules, station-service load, generator terminal voltage limits, and net reactive delivery.
- It is implemented as a companion browser app in the OFORI Power Tool repository.

## Recommended Manuscript Sections

1. Title, author, ORCID, and correspondence.
2. Abstract.
3. Index Terms.
4. Nomenclature.
5. I. Introduction.
6. II. Reliability and Standards Context.
7. III. Software Implementation.
8. IV. Input Data Model.
9. V. Calculation Methods and Equations.
10. VI. Browser App Workflow.
11. VII. Validation Case.
12. VIII. Discussion.
13. IX. Limitations.
14. X. Future Work.
15. XI. Conclusion.
16. Software Availability.
17. Reproducibility Statement.
18. Safety and Compliance Statement.
19. IEEE-style numbered References.

## Recommended Figures

| Figure | Purpose |
| --- | --- |
| Generator-GSU-infinite bus diagram | Shows the two-bus study model. |
| Generator capability curve | Shows gross lagging and leading VAR limits. |
| GSU tap sensitivity flowchart | Shows the screening calculation sequence. |
| Net VAR delivery versus tap ratio | Shows trapped reactive capability. |
| Browser app workflow capture | Shows the implemented OFORI companion tool and tap comparison outputs. |

## Recommended Tables

| Table | Purpose |
| --- | --- |
| Input data table | Documents generator, GSU, station-service, and voltage assumptions. |
| Variable definitions | Defines gross, low-side, and high-side power quantities. |
| VAR production table | Shows lagging reactive support sensitivity by tap. |
| VAR absorption table | Shows leading operation sensitivity by tap. |
| Claim boundary table | Separates screening from compliance verification. |

## Formula Coverage

The manuscript now includes clean notation for:

- Per-unit conversion of generator real power, `Q_max`, `Q_min`, and station-service load.
- GSU resistance/reactance entry using `%R`, `%X`, or optional `X/R`.
- Tap-adjusted scheduled high-side voltage.
- Production/absorption voltage-angle solution.
- Generator reactive limit enforcement.
- Terminal-voltage recovery when a reactive limit binds.
- Transformer current, real loss, reactive loss, net `P_2`, and net `Q_2`.
- Optional high-side station-service adjustment.
- Trapped reactive capability and base-to-MW/Mvar conversion.

## Reproducibility Files

| File | Purpose |
| --- | --- |
| `docs/generator-reactive-capability-manuscript.md` | Refined technical manuscript. |
| `generator-reactive.html` | Browser-based screening app page. |
| `assets/js/generator-model.js` | Browser calculation model. |
| `assets/js/generator-app.js` | Browser UI controller. |
| `matlab/generator_reactive_capability_screening.m` | Cleaned MATLAB source extracted and refined from the live script workflow. |
| `docs/generator-reactive-capability-platform-submissions.md` | Platform submission text. |
| `docs/generator-reactive-capability-release-notes.md` | Release body and package notes. |

## Standards / Reliability Source Check

Use official pages for final manuscript verification. Do not reproduce protected standard text beyond brief fair-use references.

| Reference | Official Source |
| --- | --- |
| NERC MOD-025-2 | https://www.nerc.com/pa/Stand/Reliability%20Standards/MOD-025-2.pdf |
| NERC VAR-002-4.1 | https://www.nerc.com/pa/Stand/Reliability%20Standards/VAR-002-4.1.pdf |
| IEEE power system analysis references | Use IEEE Xplore or publisher pages for target citations. |

## Best-Fit Venues

- IEEE Power & Energy Society student or conference paper.
- IEEE engineering education venue.
- Power systems planning technical note.
- University repository or OSF working paper.
- ResearchGate preprint for technical feedback.
- Zenodo/Figshare archival preprint package.

## Recommended Citation

Ofori Manu, S. (2026). *Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints* (Version 0.1.0-reactive-capability) [IEEE-style technical software preprint].

## Submission Readiness Checklist

- [x] Recreate the equations in clean notation.
- [x] Confirm and document the tap-ratio convention used by the screening app.
- [x] Convert the example values to a consistent per-unit base.
- [ ] Validate `matlab/generator_reactive_capability_screening.m` in MATLAB or Octave-compatible workflow where applicable.
- [ ] Validate the browser app against the MATLAB appendix and hand calculations.
- [ ] Add a clean one-line diagram.
- [ ] Add a generator capability curve figure.
- [x] Verify the manuscript result table values against the implemented app logic.
- [x] Add limitations and compliance boundary.
- [x] Confirm current NERC and IEEE article-structure references before submission.
