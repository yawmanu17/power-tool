# OFORI Power Tool

OFORI Power Tool is a browser-based engineering screening tool for power factor correction, load analysis, monthly energy cost estimation, and harmonics risk assessment.

The tool is designed for early-stage electrical reviews in buildings, water and wastewater utilities, workshops, and small industrial facilities. It distinguishes between fundamental power quantities and harmonic distortion so users can see why capacitor sizing, true power factor, and power-quality mitigation are related but not the same task.

## Features

- Single-phase and three-phase load calculations.
- Multiple load input modes: kW plus PF, kVA plus PF, kW plus kVAr, and kW plus current.
- Clear separation of real power, reactive power, apparent power, displacement power factor, and true power factor.
- Capacitor bank sizing for target displacement power factor.
- Monthly energy and reactive charge estimates.
- Harmonics screening with voltage THD, current THD, nonlinear load share, dominant harmonic order, distortion factor, harmonic apparent power, and transformer K-factor estimate.
- Printable report view and JSON project export.
- Modular static file structure suitable for GitHub Pages and other static hosting.

## Project Structure

```text
.
|-- index.html
|-- powerbill.html
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   `-- js/
|       |-- app.js
|       |-- charts.js
|       |-- power-model.js
|       |-- reporting.js
|       `-- storage.js
|-- docs/
|   |-- figshare.md
|   |-- github-release.md
|   |-- osf.md
|   |-- publication.md
|   `-- zenodo.md
|-- CITATION.cff
|-- CHANGELOG.md
|-- RELEASE_NOTES.md
`-- LICENSE
```

## Use

Open `index.html` in a browser or publish the repository with GitHub Pages. Enter system voltage, frequency, load details, economic rates, and harmonic screening values. Use the report tab or `powerbill.html` for a publication-ready summary.

## Engineering Notes

Power factor correction is sized from fundamental reactive power and target displacement power factor. Harmonics are handled separately as a screening layer because standard capacitor banks can interact with harmonic currents and create resonance risk. For harmonic-rich systems, validate results with site measurements and current utility or power-quality standards before procurement.

## Citation

Use the metadata in `CITATION.cff` when citing the software. A suggested short citation is:

Ofori Manu, S. (2026). OFORI Power Tool: Power Factor Correction and Harmonics Analysis (Version 1.1.0) [Software]. GitHub.

## License

Released under the MIT License.
