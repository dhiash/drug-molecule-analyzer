# Drug Molecule Analyzer

An educational computational chemistry website for exploring molecular properties, rule-based drug-likeness screens, descriptor comparisons, and illustrative structure views.

## Features

- Look up compounds by name, PubChem CID, or SMILES using PubChem PUG REST when needed.
- Analyze five built-in examples (Aspirin, Paracetamol, Ibuprofen, Caffeine, and Amoxicillin) without an API request.
- Use **Random Analysis** to select and analyze a built-in example, avoiding the most recently analyzed example when alternatives are available.
- Review molecular formula, molecular weight, exact mass, XLogP, TPSA, hydrogen-bond counts, rotatable bonds, heavy atoms, and formal charge when data is available.
- Explore Lipinski, Veber, Ghose, and Muegge rule screens.
- Compare built-in example descriptors in a chart.
- Review recent analysis history and dashboard summaries stored in browser local storage.
- Switch between light and dark themes, view the illustrative 2D/3D panels, and print or save a report.

## Technologies and data source

- Vite, vanilla JavaScript, and CSS
- Chart.js for the comparison chart
- PubChem PUG REST API for molecular properties for compounds not handled by the built-in examples
- A small curated in-code example set for offline demonstrations

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. This repository's Vite configuration uses the base path `/drug-molecule-analyzer/`, so the local development URL is normally `http://localhost:5173/drug-molecule-analyzer/`.

## Build and preview

```bash
npm run build
npm run preview
```

The production build is written to `dist/`. The preview URL is normally `http://localhost:4173/drug-molecule-analyzer/`.

## Environment variables

No environment variables are required. PubChem lookups run in the browser and require an internet connection. Built-in examples can be analyzed offline.

## Scientific calculations and limitations

- Molecular property values for non-example compounds are retrieved from PubChem. Missing values are displayed as unavailable rather than invented.
- Drug-likeness scores and Lipinski/Veber/Ghose/Muegge checks are rule-based educational screens, not validated measures of efficacy or safety.
- ADMET labels are rule-based demonstrations, not validated pharmacokinetic predictions.
- The descriptor demonstration is a transparent threshold heuristic, not a trained AI/ML model; it has no training dataset or validated predictive accuracy.
- The 2D sketch and animated 3D view are illustrative visualizations, not chemically accurate structure renderings or molecular conformer calculations.
- Comparison charts use built-in example descriptors. They do not calculate chemical fingerprint similarity.
- These estimates are for educational and experimental learning only and must not be used for clinical, diagnostic, or therapeutic decisions.

## Credits

Created with care by Jai Kishore for a friend. This project is intended for educational and experimental learning.

## Deployment note

The Vite base path is configured as `/drug-molecule-analyzer/` for the existing GitHub Pages deployment at <https://dhiash.github.io/drug-molecule-analyzer/>. If deploying the same source at a domain root (for example, a Vercel root URL), verify the hosting platform's base-path configuration before release.
