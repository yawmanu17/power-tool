# Generator Reactive Capability Platform Submission Text

## Zenodo Metadata

### Upload Type

Preprint / technical report

### Title

Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints

### Creators

Solomon Ofori Manu  
ORCID: 0009-0003-8474-8509

### Description

This IEEE-style technical software manuscript presents a browser-based screening method for evaluating how much of a generator's gross reactive capability can be delivered to a transmission system after accounting for station-service load, generator step-up transformer impedance, off-nominal tap position, high-side voltage schedule, and generator terminal voltage limits. The package includes `generator-reactive.html`, modular JavaScript calculation and interface files, and a cleaned MATLAB source appendix. The paper uses a two-bus generator/GSU/infinite-bus model to explain trapped reactive capability and supports design-stage review of GSU tap selection, voltage schedule, and net VAR delivery.

### Keywords

generator reactive capability; GSU transformer; off-nominal tap ratio; voltage stability; reactive power; NERC MOD-025; NERC VAR-002; VAR support; transmission planning; engineering software

### Version

0.1.0-reactive-capability

### Related Identifiers

- Manuscript: `docs/generator-reactive-capability-manuscript.md`
- Publication packet: `docs/generator-reactive-capability-publication-packet.md`
- Browser app: `generator-reactive.html`
- MATLAB source appendix: `matlab/generator_reactive_capability_screening.m`
- Related repository: OFORI Power Tool

### Notes

This manuscript provides a screening method and design-review framework. It does not replace full power-flow studies, dynamic stability studies, generator testing, excitation limiter review, NERC compliance verification, or transmission planner approval.

## Figshare Metadata

### Title

Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints

### Item Type

Preprint / technical report

### Authors

Solomon Ofori Manu

### Categories

Electrical and Electronic Engineering; Power Systems; Energy Engineering; Infrastructure Planning

### Description

This paper and browser app evaluate the difference between gross generator reactive capability and net reactive power delivered to the transmission system. The method considers station-service load, GSU transformer impedance, off-nominal tap position, system voltage schedule, and generator terminal voltage limits. It helps identify trapped reactive capability during design-stage review and documents the calculation workflow in reproducible JavaScript and MATLAB files.

### Keywords

generator reactive capability, GSU transformer, voltage stability, reactive power, NERC MOD-025, NERC VAR-002, transmission planning, engineering software

### Recommended Citation

Ofori Manu, S. (2026). Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints (Version 0.1.0-reactive-capability). Figshare.

## OSF Project Description

This OSF project archives a technical manuscript and browser app for generator reactive capability screening. The work examines how station-service loads, GSU transformer impedance, transformer tap position, and voltage schedules influence net reactive power delivery to the transmission system. It is intended as a design-stage engineering screening method and companion publication in the OFORI Power Tool research repository.

## ResearchGate Summary

This working paper presents a practical browser-based screening method for generator reactive capability delivery. It shows why the gross reactive capability from a generator capability curve may not equal the net VAR support delivered to the grid when station-service load, GSU losses, tap position, voltage schedule, and generator voltage limits are considered.

## Journal Cover Letter Draft

Dear Editor,

Please consider the manuscript titled "Generator Reactive Capability Screening Using GSU Transformer Tap Position, Station-Service Load, and Voltage Schedule Constraints" for publication consideration.

This paper addresses a practical power-system planning issue: generator reactive capability can be overstated if engineers rely only on gross generator capability curves. The manuscript presents a transparent two-bus screening method and companion browser implementation for estimating net VAR delivery after station-service load, GSU impedance, off-nominal tap position, voltage schedule, and generator terminal voltage limits are considered. The method is intended for early design review before full load-flow, dynamic stability, generator testing, and compliance verification studies.

Sincerely,

Solomon Ofori Manu

## One-Paragraph Public Summary

Generators may have reactive power capability on paper, but not all of that capability can always reach the grid. This paper and browser app explain how transformer tap settings, station-service loads, transformer impedance, voltage schedules, and generator voltage limits can trap reactive power inside the generator-transformer interface. The method helps engineers screen whether a generator and GSU transformer arrangement can deliver the expected voltage support to the transmission system.
