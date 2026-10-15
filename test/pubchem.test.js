import test from 'node:test';
import assert from 'node:assert/strict';
import { AnalysisError, fetchPubChemByCid, fetchPubChemByName, fetchPubChemBySmiles, validateSmiles } from '../src/pubchem.js';

function mockedResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return body; }
  };
}

test('validates basic SMILES syntax and rejects malformed branches and rings', () => {
  assert.doesNotThrow(() => validateSmiles('C1CCCCC1'));
  assert.doesNotThrow(() => validateSmiles('C[C@H](O)N'));
  assert.doesNotThrow(() => validateSmiles('[NH4+]'));
  for (const smiles of ['', 'C1CC', 'C(=O', 'C)O', 'C C', '<script>']) {
    assert.throws(() => validateSmiles(smiles), (error) => error.code === 'INVALID_SMILES');
  }
});

test('maps PubChem property response and keeps missing descriptors unavailable', async () => {
  let requestedUrl = '';
  const result = await fetchPubChemBySmiles('CCO', undefined, {
    fetchImpl: async (url) => {
      requestedUrl = url;
      return mockedResponse(200, { PropertyTable: { Properties: [{ CID: 702, ConnectivitySMILES: 'CCO', MolecularFormula: 'C2H6O' }] } });
    }
  });
  assert.match(requestedUrl, /smiles\/CCO\/property\//);
  assert.equal(result.name, 'Custom SMILES');
  assert.equal(result.cid, 702);
  assert.equal(result.formula, 'C2H6O');
  assert.equal(result.mw, null);
  assert.equal(result.exactMass, null);
});

test('name and CID lookups preserve compound identity without relabeling custom structures', async () => {
  const body = { PropertyTable: { Properties: [{ CID: 2519, CanonicalSMILES: 'CN', IUPACName: 'a compound', MolecularFormula: 'CH5N', MolecularWeight: '31.06' }] } };
  const fetchImpl = async () => mockedResponse(200, body);
  const named = await fetchPubChemByName('test name', undefined, { fetchImpl });
  const cid = await fetchPubChemByCid('2519', undefined, { fetchImpl });
  assert.equal(named.name, 'test name');
  assert.equal(cid.name, 'a compound');
  assert.equal(named.cid, cid.cid);
  assert.equal(named.smiles, cid.smiles);
  assert.equal(named.mw, 31.06);
});

test('PubChem errors have distinct input, not-found, rate-limit, and server codes', async () => {
  for (const [status, inputType, code] of [
    [404, 'name', 'NOT_FOUND'],
    [429, 'name', 'RATE_LIMIT'],
    [400, 'smiles', 'INVALID_SMILES'],
    [503, 'cid', 'SERVER']
  ]) {
    const lookup = inputType === 'smiles' ? fetchPubChemBySmiles
      : inputType === 'cid' ? fetchPubChemByCid : fetchPubChemByName;
    await assert.rejects(
      () => lookup('x', undefined, { fetchImpl: async () => mockedResponse(status, {}) }),
      (error) => error.code === code
    );
  }
});

test('unexpected response shapes, network errors, and timeouts are reported', async () => {
  await assert.rejects(
    () => fetchPubChemByCid('1', undefined, { fetchImpl: async () => mockedResponse(200, {}) }),
    (error) => error.code === 'INVALID_RESPONSE'
  );
  await assert.rejects(
    () => fetchPubChemByName('x', undefined, { fetchImpl: async () => { throw new TypeError('network'); } }),
    (error) => error.code === 'NETWORK'
  );
  await assert.rejects(
    () => fetchPubChemByName('x', undefined, {
      timeoutMs: 5,
      fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
      })
    }),
    (error) => error.code === 'TIMEOUT'
  );
});

test('caller cancellation remains distinct from a PubChem timeout', async () => {
  const controller = new AbortController();
  const request = fetchPubChemByName('x', controller.signal, {
    timeoutMs: 1000,
    fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    })
  });
  controller.abort();
  await assert.rejects(() => request, (error) => error instanceof AnalysisError && error.code === 'CANCELLED');
});
