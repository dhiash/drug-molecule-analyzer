# Drug Molecule Analyzer

An educational computational chemistry web application for exploring molecular properties, drug-likeness filters, descriptor comparisons, and illustrative structure visualizations.

## Features

- Look up molecules by name or PubChem CID, or submit a SMILES string.
- Retrieve molecular properties from PubChem PUG REST, with a small built-in example molecule set available offline.
- Review molecular formula, molecular weight, XLogP, TPSA, hydrogen-bond counts, rotatable bonds, heavy atoms, and charge when supplied by PubChem.
- Explore Lipinski, Veber, Ghose, and Muegge rule screens.
- Compare example-molecule descriptors with a chart.
- Review recent analyses saved in browser storage, switch themes, and print/save a report.
- View ADMET and descriptor-rule demonstrations with their limitations disclosed.

## Technologies

- Vite
- Vanilla JavaScript and CSS
- Chart.js
- PubChem PUG REST API

## Install and run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/drug-molecule-analyzer/`).

## Build and preview

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`. The preview server normally runs at `http://localhost:4173/drug-molecule-analyzer/`.

## GitHub Pages deployment

The GitHub Actions workflow builds the Vite application and deploys `dist/` to GitHub Pages when changes are pushed to `main`. The Vite base path is `/drug-molecule-analyzer/`. In the repository's Pages settings, select **GitHub Actions** as the build and deployment source.

Published URL: <https://dhiash.github.io/drug-molecule-analyzer/>

## Limitations

- PubChem lookups require an internet connection. The built-in example molecules can be analyzed without one.
- Descriptors for non-example molecules are sourced from PubChem; missing values are shown as unavailable rather than inferred.
- The 2D sketch and animated 3D view are illustrative visualizations, not chemically accurate structure renderings or conformer calculations.
- ADMET messages are simple rule-based demonstrations, not validated pharmacokinetic predictions.
- The descriptor demo is a transparent threshold heuristic, not a trained machine-learning model. It has no training dataset or validated accuracy.
- Molecule comparison charts show descriptor values for the built-in examples; no chemically validated fingerprint similarity is calculated.
- This browser application is not a substitute for a cheminformatics toolkit or experimental measurements.

## Scientific disclaimer

This application is intended for educational and research demonstration purposes only. Molecular descriptors and predictions should not be interpreted as clinical, diagnostic, or therapeutic advice.
