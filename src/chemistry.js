export function numberOrNull(value) {
  if ((typeof value !== 'number' && typeof value !== 'string') || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatValue(value, digits = 2, suffix = '') {
  const number = numberOrNull(value);
  return number === null ? 'Not available' : `${number.toFixed(digits)}${suffix}`;
}

export function countFormulaAtoms(formula) {
  if (typeof formula !== 'string' || !formula) return null;
  const tokens = formula.match(/[A-Z][a-z]?\d*/g);
  if (!tokens || tokens.join('') !== formula) return null;
  return tokens.reduce((total, token) => {
    const count = Number(token.match(/\d+$/)?.[0] || 1);
    return total + count;
  }, 0);
}

export function evaluateDrugLikeness(props) {
  const lipinski = {
    mwPass: props.mw == null ? null : props.mw <= 500,
    logpPass: props.logp == null ? null : props.logp <= 5,
    hbdPass: props.hbd == null ? null : props.hbd <= 5,
    hbaPass: props.hba == null ? null : props.hba <= 10
  };
  const lipinskiResults = Object.values(lipinski);
  const lipinskiComplete = lipinskiResults.every((value) => value !== null);
  const lipinskiViolations = lipinskiResults.filter((value) => value === false).length;
  const veberPass = props.rot == null || props.tpsa == null ? null : props.rot <= 10 && props.tpsa <= 140;
  const ghoseValues = [props.mw, props.logp, props.molarRefractivity, props.atomCount];
  const ghosePass = ghoseValues.some((value) => value == null)
    ? null
    : props.mw >= 160 && props.mw <= 480
      && props.logp >= -0.4 && props.logp <= 5.6
      && props.molarRefractivity >= 40 && props.molarRefractivity <= 130
      && props.atomCount >= 20 && props.atomCount <= 70;
  const mueggeValues = [props.mw, props.logp, props.tpsa, props.rot, props.hba, props.hbd];
  const mueggePass = mueggeValues.some((value) => value == null)
    ? null
    : props.mw >= 200 && props.mw <= 600
      && props.logp >= -2 && props.logp <= 5
      && props.tpsa <= 150 && props.rot <= 15
      && props.hba <= 10 && props.hbd <= 5;
  const scoreValues = [props.mw, props.logp, props.tpsa, props.hbd, props.hba];
  const score = scoreValues.every((value) => value != null)
    ? Math.round(scoreValues.filter((value, index) => value <= [500, 5, 140, 5, 10][index]).length / scoreValues.length * 100)
    : null;
  return {
    score,
    label: score === null ? 'Insufficient data' : score === 100 ? 'All custom thresholds met' : score >= 60 ? 'Most custom thresholds met' : 'Few custom thresholds met',
    lipinski: { ...lipinski, violations: lipinskiComplete ? lipinskiViolations : null, pass: lipinskiComplete ? lipinskiViolations <= 1 : null },
    veber: { pass: veberPass },
    ghose: { pass: ghosePass },
    muegge: { pass: mueggePass },
    overall: !lipinskiComplete ? 'INSUFFICIENT DATA' : lipinskiViolations <= 1 ? 'LIPINSKI RULE OF FIVE: PASS' : 'LIPINSKI RULE OF FIVE: FAIL'
  };
}

export function createDescriptorDemo(props) {
  const checks = [props.mw <= 500, props.logp <= 5, props.tpsa <= 140, props.hbd <= 5, props.hba <= 10];
  const values = [props.mw, props.logp, props.tpsa, props.hbd, props.hba];
  const available = checks.filter((_, index) => values[index] != null);
  const passes = available.filter(Boolean).length;
  return {
    prediction: available.length === 0
      ? 'Insufficient descriptor data'
      : passes >= 4 ? 'Most demo thresholds met' : passes >= 2 ? 'Some demo thresholds met' : 'Few demo thresholds met',
    score: available.length ? passes : null,
    totalChecks: available.length,
    modelName: 'Rule-based descriptor heuristic; not a trained model',
    dataset: 'No training dataset or validated accuracy',
    importantFactors: [
      { label: 'LogP', value: props.logp },
      { label: 'Molecular weight', value: props.mw },
      { label: 'TPSA', value: props.tpsa },
      { label: 'H-bond donors', value: props.hbd },
      { label: 'H-bond acceptors', value: props.hba }
    ]
  };
}
