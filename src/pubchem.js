import { numberOrNull } from './chemistry.js';

const PROPERTY_FIELDS = 'CanonicalSMILES,ConnectivitySMILES,MolecularFormula,MolecularWeight,ExactMass,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount,Charge,IUPACName';

export class AnalysisError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

export function validateSmiles(smiles) {
  if (typeof smiles !== 'string' || !smiles || smiles.length > 2000 || /\s/.test(smiles) || !/^[A-Za-z0-9@+\-()[\]=#$%./\\:*]+$/.test(smiles)) {
    throw new AnalysisError('INVALID_SMILES');
  }
  let parentheses = 0;
  let brackets = 0;
  for (const character of smiles) {
    if (character === '(') parentheses += 1;
    if (character === ')') parentheses -= 1;
    if (character === '[') brackets += 1;
    if (character === ']') brackets -= 1;
    if (parentheses < 0 || brackets < 0) throw new AnalysisError('INVALID_SMILES');
  }
  if (parentheses !== 0 || brackets !== 0) throw new AnalysisError('INVALID_SMILES');
  const outsideBrackets = smiles.replace(/\[[^\]]*\]/g, '');
  const rings = outsideBrackets.match(/%[0-9]{2}|[0-9]/g) || [];
  const ringCounts = new Map();
  rings.forEach((ring) => ringCounts.set(ring, (ringCounts.get(ring) || 0) + 1));
  if ([...ringCounts.values()].some((count) => count !== 2)) throw new AnalysisError('INVALID_SMILES');
}

export async function fetchPubChem(path, inputType, query, signal, options = {}) {
  if (signal?.aborted) throw new AnalysisError('CANCELLED');
  const fetchImpl = options.fetchImpl || fetch;
  const timeoutMs = options.timeoutMs ?? 12000;
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller, { once: true });
  try {
    let response;
    try {
      response = await fetchImpl(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${path}/property/${PROPERTY_FIELDS}/JSON`, { signal: controller.signal });
    } catch (error) {
      if (timedOut) throw new AnalysisError('TIMEOUT');
      if (signal?.aborted) throw new AnalysisError('CANCELLED');
      if (error instanceof TypeError) throw new AnalysisError('NETWORK');
      throw new AnalysisError('SERVER');
    }
    let data = null;
    try { data = await response.json(); } catch { /* Non-JSON errors are mapped from the HTTP status. */ }
    if (!response.ok) {
      const apiCode = data?.Fault?.Code || data?.Fault?.Details?.[0];
      if (response.status === 429) throw new AnalysisError('RATE_LIMIT');
      if (response.status === 404 || apiCode === 'PUGREST.NotFound') throw new AnalysisError('NOT_FOUND');
      if (response.status === 400) throw new AnalysisError(inputType === 'smiles' ? 'INVALID_SMILES' : 'NOT_FOUND');
      if (response.status >= 500) throw new AnalysisError('SERVER');
      throw new AnalysisError('INVALID_RESPONSE');
    }
    const props = data?.PropertyTable?.Properties?.[0];
    const smiles = props?.CanonicalSMILES || props?.ConnectivitySMILES;
    if (!props || typeof props !== 'object' || !smiles || typeof smiles !== 'string') throw new AnalysisError('INVALID_RESPONSE');
    const cid = numberOrNull(props.CID);
    return {
      cid: Number.isSafeInteger(cid) && cid > 0 ? cid : null,
      name: inputType === 'name' ? query : inputType === 'cid' ? props.IUPACName || `PubChem CID ${query}` : 'Custom SMILES',
      smiles,
      formula: typeof props.MolecularFormula === 'string' ? props.MolecularFormula : null,
      mw: numberOrNull(props.MolecularWeight),
      exactMass: numberOrNull(props.ExactMass),
      logp: numberOrNull(props.XLogP),
      tpsa: numberOrNull(props.TPSA),
      hbd: numberOrNull(props.HBondDonorCount),
      hba: numberOrNull(props.HBondAcceptorCount),
      rot: numberOrNull(props.RotatableBondCount),
      heavy: numberOrNull(props.HeavyAtomCount),
      formalCharge: numberOrNull(props.Charge),
      molarRefractivity: null
    };
  } catch (error) {
    if (error instanceof AnalysisError) throw error;
    if (timedOut) throw new AnalysisError('TIMEOUT');
    if (signal?.aborted) throw new AnalysisError('CANCELLED');
    throw new AnalysisError('INVALID_RESPONSE');
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

export function fetchPubChemByName(name, signal, options) {
  return fetchPubChem(`name/${encodeURIComponent(name)}`, 'name', name, signal, options);
}

export function fetchPubChemByCid(cid, signal, options) {
  return fetchPubChem(`cid/${encodeURIComponent(cid)}`, 'cid', cid, signal, options);
}

export function fetchPubChemBySmiles(smiles, signal, options) {
  return fetchPubChem(`smiles/${encodeURIComponent(smiles)}`, 'smiles', smiles, signal, options);
}
