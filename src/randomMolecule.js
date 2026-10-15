export function chooseRandomMolecule(molecules, previousCid = null, random = Math.random) {
  if (!Array.isArray(molecules) || molecules.length === 0) {
    throw new RangeError('At least one molecule is required');
  }
  const candidates = molecules.length > 1
    ? molecules.filter((molecule) => molecule.cid !== previousCid)
    : molecules;
  const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length));
  return candidates[Math.max(0, index)];
}
