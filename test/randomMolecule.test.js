import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseRandomMolecule } from '../src/randomMolecule.js';

const molecules = [
  { name: 'Aspirin', cid: 2244 },
  { name: 'Paracetamol', cid: 1983 },
  { name: 'Caffeine', cid: 2519 }
];

test('random selection returns a curated molecule and avoids the previous CID', () => {
  assert.equal(chooseRandomMolecule(molecules, 2244, () => 0).name, 'Paracetamol');
  assert.equal(chooseRandomMolecule(molecules, 2244, () => 0.99).name, 'Caffeine');
});

test('single-option selection remains available and invalid random values stay in range', () => {
  assert.equal(chooseRandomMolecule([molecules[0]], 2244, () => 0.5).name, 'Aspirin');
  assert.equal(chooseRandomMolecule(molecules, null, () => 1).cid, 2519);
});

test('selection requires at least one curated molecule', () => {
  assert.throws(() => chooseRandomMolecule([]), RangeError);
});
