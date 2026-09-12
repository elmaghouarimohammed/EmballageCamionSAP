export function parseNonNegativeNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }

  const parsed = parseFloat(String(value).replace(',', '.'));

  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function parseNonNegativeInteger(value) {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }

  const parsed = parseInt(String(value), 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function formatWeight(value) {
  return `${Number(value).toFixed(2)} kg`;
}

export function formatNumber(value) {
  return Number(value).toFixed(2);
}

export function isValidDecimalInput(value) {
  if (value === '') return true;
  return /^\d*\.?\d*$/.test(value);
}

export function isValidIntegerInput(value) {
  if (value === '') return true;
  return /^\d+$/.test(value);
}
