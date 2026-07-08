# Release Notes: OFORI Power Tool Paper Package v1.1.0

## Summary

Version 1.1.0 prepares the original "Design program for Power Factor Correction and Load Analysis" as a modern publication package around the current OFORI Power Tool application. The paper now follows a software-paper structure and incorporates load analysis, power factor correction, harmonics screening, economic review, standards-aware prompts, and publication platform text.

## Highlights

- Reframes the original program as a browser-based engineering screening application.
- Incorporates the current app modules, including `assets/js/power-model.js`, `assets/js/standards-model.js`, charts, reporting, and storage/export.
- Adds clear distinctions between displacement PF, true PF, capacitor correction, and harmonic mitigation.
- Adds practical industrial inputs such as motor HP, efficiency, demand factor, current + PF, kW + PF, kVA + PF, and kW + kVAr.
- Adds standards-aware framing for IEC 60038, IEC 61000, IEEE 519, and NEC/NFPA 70 review needs.
- Upgrades the manuscript to an IEEE-style structure with Abstract, Index Terms, Nomenclature, roman-numeral sections, numbered equations, validation case, software availability, reproducibility, and safety statements.
- Adds a manuscript draft, publication packet, platform submission text, and release notes.

## Recommended Release Tag

paper-v1.1.0

## Suggested GitHub Release Title

OFORI Power Tool Paper Package v1.1.0: Power Factor Correction, Harmonics, and Standards-Aware Review

## Suggested DOI Title

OFORI Power Tool: Browser-Based Power Factor Correction, Load Analysis, and Harmonics Screening Software

## Suggested GitHub Release Body

This release provides the publication package for OFORI Power Tool v1.1.0. It updates the original power factor correction and load analysis paper into a modern software-paper format that documents the current browser-based application.

The package includes:

- Full manuscript draft.
- Publication packet.
- Platform submission text for Zenodo, Figshare, OSF, ResearchGate, and journal cover letters.
- Claim-boundary guidance for standards-aware screening.
- Suggested release and DOI metadata.

The app supports practical load entry, single-phase and three-phase calculations, capacitor correction, harmonics screening, economics, standards review prompts, charts, printable report output, and JSON export.

## Limitations

The paper and software describe a screening tool. Final capacitor bank design, harmonic compliance, code compliance, short-circuit duty, protection coordination, arc-flash analysis, and equipment procurement must be verified with measured site data, applicable standards, local code requirements, utility rules, manufacturer data, and qualified professional review.

## Recommended Files To Include In A Release

- `docs/paper-manuscript.md`
- `docs/paper-publication-packet.md`
- `docs/paper-platform-submissions.md`
- `docs/paper-release-notes.md`
- `docs/publication.md`
- `docs/zenodo.md`
- `docs/figshare.md`
- `docs/osf.md`
- `docs/github-release.md`
- `CITATION.cff`
- `RELEASE_NOTES.md`
- `README.md`
- `index.html`
- `powerbill.html`
- `assets/css/styles.css`
- `assets/js/`
