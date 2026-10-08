# Drug Molecule Analyzer

An educational computational chemistry prototype for exploring molecular properties, drug-likeness filters, structural visualization, comparison, and AI/ML demo prediction workflows.

## Features

- Molecule lookup by drug name, SMILES, or PubChem CID
- Calculated molecular property summaries using RDKit-style descriptors when available
- 2D structure rendering and simplified 3D viewer
- Drug-likeness assessment using Lipinski, Veber, Ghose, and Muegge rules
- ADMET analysis with clear "Demo prediction" labeling
- Similarity comparison using Morgan-style fingerprints and Tanimoto scoring
- Demo AI/ML prediction workflow with explainability notes
- Local history tracking and dashboard summary cards
- Report generation via the browser print dialog

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

This project is an educational and research prototype. It does not claim medical or clinical guarantees and should not replace laboratory experiments or professional advice.
