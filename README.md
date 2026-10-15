# Drug Molecule Analyzer

An educational computational chemistry web application for exploring PubChem molecular properties, rule-based descriptor screens, and illustrative structure views.

## Features

- Look up one identifier at a time by name, PubChem CID, or SMILES. Conflicting fields are rejected.
- Use **Random Analysis** to choose a curated example compound and fetch its current properties from PubChem.
- Retrieve PubChem molecular properties, with a small built-in example molecule set available offline by name.
- Review molecular formula, molecular weight, XLogP, TPSA, hydrogen-bond counts, rotatable bonds, heavy atoms, and charge when supplied by PubChem.
- Explore Lipinski Rule of Five, Veber, Ghose, and a clearly identified Muegge descriptor-subset screen. Incomplete inputs remain unavailable.
- Compare built-in example descriptors using within-descriptor normalized bars and original-value tooltips.
- Review recent analyses saved in browser storage, switch themes, and print/save a report.
- View an authentic PubChem 2D depiction when available, plus a separate decorative animation that is explicitly not a molecular model.
- View ADMET and descriptor-rule demonstrations with their limitations disclosed; no trained prediction model is included.

## Technologies

- Vite
- Vanilla JavaScript and CSS
- Chart.js
- PubChem PUG REST API

## Install and run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`).
No environment variables or API keys are required. Random Analysis uses the curated example CIDs and PubChem's public PUG REST API.

## Checks

```bash
npm run lint
npm test
npm run build
```

The tests use Node's built-in test runner and mock PubChem responses; they do not make external API calls.

## Build and preview

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`. The preview server normally runs at `http://localhost:4173/`.

## GitHub Pages deployment

The GitHub Actions workflow runs linting and tests, builds the Vite application using the `/drug-molecule-analyzer/` base path, and deploys `dist/` when changes are pushed to `main`. In the repository's Pages settings, select **GitHub Actions** as the build and deployment source.

Published URL: <https://dhiash.github.io/drug-molecule-analyzer/>

## Vercel deployment

Import this repository into Vercel and use the Vite defaults:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: repository root
- Environment variables: none required

The default Vite base path is `/`, which is appropriate for a Vercel domain root. Do not set `GITHUB_PAGES=true` in Vercel. The GitHub Pages workflow alone sets that variable for its project subpath.

## Limitations

- PubChem lookups require an internet connection. The built-in example molecules can be analyzed without one.
- Descriptors for non-example molecules are sourced from PubChem; missing values are shown as unavailable rather than inferred.
- The 2D image is PubChem's depiction, not a local chemistry-aware structure parser; its availability and stereochemical detail depend on PubChem.
- The rotating graphic is decorative only. It does not depict the selected molecule or represent calculated 3D geometry. Rotation, zoom, pause/resume, and reset only affect that illustration.
- ADMET messages are simple rule-based demonstrations, not validated pharmacokinetic predictions.
- The custom descriptor score and descriptor demo are transparent threshold heuristics, not trained machine-learning models. They have no training dataset or validated accuracy.
- Ghose screening is unavailable because the requested PubChem descriptors do not include molar refractivity. The Muegge result evaluates a descriptor subset only; ring and atom-composition criteria are not evaluated.
- Molecule comparison charts show descriptor values for the built-in examples; no chemically validated fingerprint similarity is calculated.
- This browser application is not a substitute for a cheminformatics toolkit or experimental measurements.

## Scientific disclaimer

This application is intended for educational and research demonstration purposes only. Molecular descriptors and predictions should not be interpreted as clinical, diagnostic, or therapeutic advice.

## Credits

Created with care by Jai Kishore for a friend. This project is intended for educational and experimental learning.
