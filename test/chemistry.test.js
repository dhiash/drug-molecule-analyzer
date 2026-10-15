import test from 'node:test';
import assert from 'node:assert/strict';
import { countFormulaAtoms, createDescriptorDemo, evaluateDrugLikeness, formatValue, numberOrNull } from '../src/chemistry.js';

const complete = { mw: 500, logp: 5, tpsa: 140, hbd: 5, hba: 10, rot: 10, molarRefractivity: 40, atomCount: 20 };

test('numeric descriptor formatting preserves missing values', () => {
  assert.equal(numberOrNull(null), null);
  assert.equal(numberOrNull(''), null);
  assert.equal(numberOrNull('not a number'), null);
  assert.equal(formatValue(null), 'Not available');
  assert.equal(formatValue(180.16, 2, ' Da'), '180.16 Da');
});

test('formula atom counts include explicit hydrogen and reject malformed formulas', () => {
  assert.equal(countFormulaAtoms('C9H8O4'), 21);
  assert.equal(countFormulaAtoms('C16H19N3O5S'), 44);
  assert.equal(countFormulaAtoms('C6H5(OH)'), null);
  assert.equal(countFormulaAtoms(''), null);
});

test('Lipinski tolerates one violation and uses inclusive boundaries', () => {
  const result = evaluateDrugLikeness(complete);
  assert.equal(result.lipinski.pass, true);
  assert.equal(result.score, 100);
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 500.01 }).lipinski.pass, true);
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 500.01, logp: 5.01 }).lipinski.pass, false);
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 500.01 }).score, 80);
});

test('incomplete descriptors remain unavailable in rule results and score', () => {
  const result = evaluateDrugLikeness({ ...complete, logp: null, molarRefractivity: null });
  assert.equal(result.lipinski.pass, null);
  assert.equal(result.ghose.pass, null);
  assert.equal(result.score, null);
});

test('Ghose and Muegge boundaries use their respective descriptors', () => {
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 480 }).ghose.pass, true);
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 480, molarRefractivity: 39.99 }).ghose.pass, false);
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 200 }).muegge.pass, true);
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 199.99 }).muegge.pass, false);
  assert.equal(evaluateDrugLikeness({ ...complete, mw: 600, logp: -2 }).muegge.pass, true);
  assert.equal(evaluateDrugLikeness({ ...complete, logp: -2.01 }).muegge.pass, false);
});

test('Veber requires both thresholds and treats the boundaries as inclusive', () => {
  assert.equal(evaluateDrugLikeness(complete).veber.pass, true);
  assert.equal(evaluateDrugLikeness({ ...complete, rot: 10.01 }).veber.pass, false);
  assert.equal(evaluateDrugLikeness({ ...complete, tpsa: 140.01 }).veber.pass, false);
  assert.equal(evaluateDrugLikeness({ ...complete, rot: null }).veber.pass, null);
});

test('descriptor demonstration identifies itself and handles absent data', () => {
  const result = createDescriptorDemo({ mw: 300, logp: 2, tpsa: 70, hbd: 1, hba: 4 });
  assert.equal(result.score, 5);
  assert.match(result.modelName, /not a trained model/);
  assert.equal(createDescriptorDemo({ mw: null, logp: null, tpsa: null, hbd: null, hba: null }).score, null);
});


test('very small non-drug compounds are not labelled drug-like by upper-bound rules alone', () => {
  const water = { mw: 18.015, logp: -0.3, tpsa: 31, hbd: 0, hba: 1, rot: 0, molarRefractivity: null, atomCount: 3 };
  const result = evaluateDrugLikeness(water);
  assert.equal(result.score, 0);
  assert.match(result.label, /Unlikely drug-like/);
  assert.match(result.overall, /UNLIKELY DRUG-LIKE/);
  assert.match(createDescriptorDemo(water).prediction, /Unlikely drug-like candidate/);
});
